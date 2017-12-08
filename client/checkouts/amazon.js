/* global amazon, OffAmazonPayments */
const xhr = require('xhr');
const load = require('load-script2');

exports.loadAmazonCheckout = function loadAmazonCheckout(state, emitter) {
  load(
    'https://static-na.payments-amazon.com/OffAmazonPayments/us/' +
      'sandbox/js/Widgets.js',
    function(err) {
      if (err) {
        return emitter.emit('log:error', err);
      }

      return xhr(
        {
          uri: '/api/amazon-key',
          json: true
        },
        function(err, resp, body) {
          emitter.emit('log:debug', body);
          if (err || resp.statusCode !== 200) {
            return emitter.emit('log:error', 'Error loading stripe');
          }

          state.amazonKey = body.key;
          state.amazonLoaded = true;

          window.onAmazonLoginReady = function() {
            amazon.Login.setClientId(state.amazonKey);
          };
          emitter.emit('amazonLoaded');
          emitter.emit('log:info', 'loaded amazon checkout.js');
          return null;
        }
      );
    }
  );
};

exports.renderAmazonElements = function renderAmazonElements(state, emitter) {
  if (!state.amazonLoaded) {
    // wait for the amazon script to load
    return setTimeout(() => {
      renderAmazonElements(state, emitter);
    }, 0);
  }
  if (
    !document.getElementById('AmazonPayButton') ||
    !document.getElementById('walletWidgetDiv')
  ) {
    // amazon elements div(s) are not rendered yet
    // push this function back on to the call stack
    // this will give the div(s) a chance to render before
    // this function is run again
    return setTimeout(() => {
      renderAmazonElements(state, emitter);
    }, 0);
  }
  let authRequest;
  OffAmazonPayments.Button('AmazonPayButton', state.amazonKey, {
    type: 'PwA',
    color: 'LightGray',
    authorization: function() {
      const loginOptions = {
        scope: 'payments:widget',
        popup: true
      };
      authRequest = amazon.Login.authorize(loginOptions);
      emitter.emit('log:info', authRequest);
    },
    onError: function(error) {
      emitter.emit(
        'log:info',
        `Amazon Error ${JSON.stringify(error, null, 2)}`
      );
      state.checkout.error = error.message;
      state.amazon.login.fail = true;
    }
  });
  // new OffAmazonPayments.Widgets.Wallet({
  //   sellerId: 'YOUR_SELLER_ID_HERE',
  //   onReady: function(billingAgreement) {
  //     var billingAgreementId = billingAgreement.getAmazonBillingAgreementId();
  //   },
  //   agreementType: 'BillingAgreement',
  //   design: {
  //     designMode: 'responsive'
  //   },
  //   onPaymentSelect: function(billingAgreement) {
  //     // Replace this code with the action that you want to perform
  //     // after the payment method is selected.
  //   },
  //   onError: function(error) {
  //     // your error handling code
  //     state.checkout.error = error.message;
  //   }
  // }).bind('walletWidgetDiv');
  return null;
};

exports.handleAmazonCheckout = function handleAmazonCheckout(state, emitter) {
  const { amount, checkoutMethod } = state.donation;
  if (!amount || !checkoutMethod || checkoutMethod !== 'amazon') {
    return;
  }
  document.body.classList.add('dialogIsOpen');
  document.body.addEventListener('click', (e, ...args) => {
    console.info(e, args);
  });
};
