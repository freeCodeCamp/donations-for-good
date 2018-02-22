import xhr from 'xhr';
import axios from 'axios';

export function loadAmazonKey(cb) {
  return xhr(
    {
      uri: '/api/amazon-key',
      json: true
    },
    function(err, resp, body) {
      if (err || resp.statusCode !== 200) {
        return cb(err);
      }
      return cb(null, body.keys);
    }
  );
}

function renderConsent({ merchant, checkout }) {
  const { amazonBillingAgreementId } = checkout;
  new OffAmazonPayments.Widgets.Consent({
    sellerId: merchant,
    // amazonBillingAgreementId obtained from the Amazon Address Book widget.
    amazonBillingAgreementId,
    design: {
      designMode: 'responsive'
    },
    onReady: function consentOnReady(billingAgreementConsentStatus) {
      // Called after widget renders
      const status =
        billingAgreementConsentStatus.getConsentStatus() === 'true';
      checkout.update('consentGiven', status);
    },
    onConsent: function consentOnConsent(billingAgreementConsentStatus) {
      const status =
        billingAgreementConsentStatus.getConsentStatus() === 'true';
      checkout.update('consentGiven', status);
    },
    onError: function consentOnError(error) {
      // your error handling code
      checkout.update('error', error.message);
      console.info(error);
    }
  }).bind('consentWidgetDiv ');
}

function renderWallet(merchant, checkout) {
  new OffAmazonPayments.Widgets.Wallet({
    sellerId: merchant,
    onReady: function walletOnReady(billingAgreement) {
      checkout.update(
        'amazonBillingAgreementId',
        billingAgreement.getAmazonBillingAgreementId()
      );
      renderConsent({
        merchant,
        checkout
      });
    },
    agreementType: 'BillingAgreement',
    design: {
      designMode: 'responsive'
    },
    onPaymentSelect: function walletOnPaymentSelect(billingAgreement) {
      // Replace this code with the action that you want to perform
      // after the payment method is selected.
    },
    onError: function walletOnError(error) {
      // your error handling code
      checkout.update('error', error.message);
    }
  }).bind('walletWidgetDiv');
}

export function renderAmazonElements(amazonKeys, checkout) {
  let billingAgreementId;
  let buyerBillingAgreementConsentStatus;
  const { merchant, public: publicKey } = amazonKeys;
  const {
    __AMAZON_LOGIN_READY__: login,
    __AMAZON_PAYMENTS_READY__: payments
  } = window;
  if (!merchant || !publicKey) {
    console.error('AMAZON KEYS', merchant, publicKey);
  }
  if (!document.getElementById('amazon-PayButton')) {
    console.warn('NO AMAZONPAY DIV');
  }
  if (!login || !payments) {
    setTimeout(() => {
      renderAmazonElements(amazonKeys, checkout);
    }, 100);
    return;
  }
  amazon.Login.setClientId(publicKey);
  let authRequest;
  OffAmazonPayments.Button('amazon-PayButton', merchant, {
    type: 'PwA',
    color: 'LightGray',
    authorization: function() {
      const loginOptions = {
        scope: 'payments:widget',
        popup: true
      };
      authRequest = amazon.Login.authorize(loginOptions);
      function isAuthorised() {
        if (authRequest.status === 'complete') {
          checkout.update('authorised', true);
          checkout.update('amazonAuthRequest', authRequest);
          renderWallet(merchant, checkout);
        } else {
          setTimeout(isAuthorised, 1000);
        }
      }
      isAuthorised();
    },
    onError: function(error) {
      console.log(`Amazon Error ${JSON.stringify(error, null, 2)}`);
      checkout.update('error', error.message);
    }
  });
}

exports.handleAmazonCheckout = function handleAmazonCheckout(
  amazonKeys,
  checkout
) {
  checkout.update('requireConsent', false);
  checkout.update('error', false);
  const { amazonBillingAgreementId, consentGiven } = checkout;
  if (!consentGiven) {
    checkout.update('requireConsent', true);
    checkout.update('error', 'Consent must be given to proceed');
  }

  axios
    .post('/api/confirm-amazon', { amazonBillingAgreementId })
    .then(res => console.log(res))
    .catch(err => console.error(err));
};
