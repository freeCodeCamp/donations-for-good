import React from 'react';
import { handleAmazonCheckout } from '../clientCheckouts/amazon';
import '../css/amazon-checkout.css';

function AmazonCheckout(props) {
  const { amazonKeys, checkout, shouldRender } = props;
  if (!shouldRender) {
    return null;
  }
  const { requireConsent, consentGiven } = checkout;
  return (
    <div id="amazon-checkout">
      <div id="walletWidgetDiv" />
      <div
        id="consentWidgetDiv"
        className={`${requireConsent && !consentGiven ? 'animate' : ''}`}
      />
      <button
        id="payment-confirm"
        onClick={() => handleAmazonCheckout(amazonKeys, checkout)}
        className={
          'mt2 f6 f4-ns tc b dib pv3 ph3 link inv ' +
          'color-neutral-80 ba b--green'
        }
      >
        Proceed With Donation
      </button>
    </div>
  );
}

AmazonCheckout.displayName = 'AmazonCheckout';

export default AmazonCheckout;
