import React from 'react';
import ReactGA from '../googleAnalytics';
import { paypalButtonValues } from '../clientCheckouts/paypal';

// import AmazonPay from "../../static/images/payment-logos/Amazon-Pay-logo.png"
import PayPal from '../../static/images/payment-logos/pp-logo-200px.png';

class ProviderButtons extends React.Component {
  constructor(props) {
    super(props);
    // react complains when these are not held in state
    this.state = {
      paypalButtonValues
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    const {
      donationAmount,
      handleCheckout,
      isProduction,
      updateProvider
    } = this.props;
    const { id } = e.target;
    const unsafeProvider = id.includes('-') ? id.split('-')[0] : id;
    const provider = /amazon/i.test(unsafeProvider) ? 'amazon' : unsafeProvider;
    updateProvider(provider);
    setTimeout(() => {
      handleCheckout();
    }, 0);
    ReactGA.event({
      category: `${isProduction ? '' : 'test-'}donation-provider`,
      action: 'click',
      label: id,
      value: donationAmount / 100
    });
  }

  render() {
    const { donationAmount } = this.props;
    const { paypalButtonValues } = this.state;
    return (
      <div className="donate-button-list-wrapper">
        <ul className="list pl0 mb0 payment-methods">
          <li className="dib mr2 mb2 full-width">
            <button
              onClick={this.handleClick}
              id="stripe"
              className={
                'mt2 f6 f4-ns tc b dib pv3 ph3 link inv ' +
                'color-neutral-80 ba b--green full-width'
              }
            >
              Credit or Debit Card
            </button>
          </li>
          <li className="dib mr2 mb2 full-width">
            <form
              action="//www.paypal.com/cgi-bin/webscr"
              method="post"
              target="_blank"
            >
              <input name="cmd" type="hidden" value="_s-xclick" />
              <input
                name="hosted_button_id"
                type="hidden"
                value={paypalButtonValues[donationAmount]}
              />
              <button
                className={
                  'mt2 f6 f4-ns tc b dib pv3 ph3 link inv ' +
                  'color-neutral-80 ba b--green full-width'
                }
                id="paypal-button"
                name="submit"
                onClick={this.handleClick}
                type="submit"
              >
                <img
                  alt="pay with PayPal"
                  id="paypal-image"
                  src={PayPal}
                  title="Pay with PayPal"
                />
              </button>
            </form>
          </li>
        </ul>
      </div>
    );
  }
}

ProviderButtons.displayName = 'ProviderButtons';

export default ProviderButtons;

/* <li className="dib mr2 mb2 full-width">
  <button
    id="amazon-button"
    onClick={this.handleClick}
    className={
      "mt2 f6 f4-ns tc b dib pv3 ph3 link inv " +
      "color-neutral-80 ba b--green full-width"
    }
  >
    <div id="amazon-PayButton" />
  </button>
</li> */
