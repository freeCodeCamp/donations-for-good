import React from "react"
import DonateAmounts from "./DonateAmounts"
import ProviderButtons from "./ProviderButtons"
import DonateResults from "./DonateResults"
import AmazonCheckout from "./AmazonCheckout"

import { loadStripeKey, stripeCheckout } from "../clientCheckouts/stripe"
import { loadAmazonKey, renderAmazonElements } from "../clientCheckouts/amazon"

const checkoutHandlers = {
  amazon: () => {},
  paypal: () => {},
  stripe: stripeCheckout
}

class DonateView extends React.Component {
  constructor(props) {
    super(props)

    this.handleCheckout = this.handleCheckout.bind(this)
    this.updateAmount = this.updateAmount.bind(this)
    this.updateCheckout = this.updateCheckout.bind(this)
    this.updateProvider = this.updateProvider.bind(this)

    this.state = {
      checkout: {
        amazonAuthRequest: {},
        amazonBillingAgreementId: "",
        authorised: false,
        consentGiven: false,
        error: false,
        pending: false,
        requireConsent: false,
        success: false,
        update: this.updateCheckout
      },
      isProduction: false,
      donation: {
        amount: 3500,
        provider: ""
      },
      stripe: {},
      amazon: {}
    }
  }

  componentDidMount() {
    loadStripeKey((err, key) => {
      if (err) {
        console.log(err)
      }
      this.setState(() => ({
        stripe: { key },
        isProduction: !key.includes("_test_")
      }))
    })
    // Commented out for release
    // loadAmazonKey((err, keys) => {
    //   if (err) {
    //     console.log(err)
    //   }
    //   this.setState(() => ({
    //     amazon: { ...keys }
    //   }))
    //   const { amazon, checkout } = this.state
    //   renderAmazonElements(amazon, checkout)
    // })
  }

  handleCheckout() {
    this.setState(state => ({
      checkout: {
        ...state.checkout,
        error: false,
        pending: true,
        success: false
      }
    }))
    const {
      checkout,
      donation,
      isProduction,
      stripe: { key: stripeKey }
    } = this.state
    const { provider } = donation
    const keys = {
      stripeKey
    }
    checkoutHandlers[provider]({ keys, checkout, donation, isProduction })
  }

  updateCheckout(key, value) {
    this.setState(state => ({
      checkout: {
        ...state.checkout,
        [key]: value
      }
    }))
  }

  updateAmount(amount) {
    this.setState(state => ({
      donation: {
        ...state.donation,
        amount: parseInt(amount, 10)
      }
    }))
  }

  updateProvider(provider) {
    this.setState(state => ({
      donation: {
        ...state.donation,
        provider
      }
    }))
  }

  render() {
    const { amazon, checkout, donation, isProduction } = this.state
    const { amount } = donation
    const { error, pending, success } = checkout
    const donateProcessed = pending || (success || error)
    return (
      <div>
        <CustomDonation />
        <h5 className="f4 mv0 color-neutral-80">How much to donate monthly:</h5>
        <DonateAmounts
          donationAmount={amount}
          isProduction={isProduction}
          updateAmount={this.updateAmount}
        />
        <br />
        <h5 className="f4 mv0 color-neutral-80">How to donate:</h5>
        <ProviderButtons
          donationAmount={amount}
          handleCheckout={this.handleCheckout}
          isProduction={isProduction}
          updateProvider={this.updateProvider}
        />
        <br />
        <p className="lh-copy measure f5 mt4 mt0-ns">
          We receive donations in USD minus fees.
        </p>
        {donateProcessed ? (
          <DonateResults checkout={checkout} donation={donation} />
        ) : null}
        <AmazonCheckout
          checkout={checkout}
          amazonKeys={amazon}
          shouldRender={donation.provider === "amazon" && checkout.authorised}
        />
      </div>
    )
  }
}

const CustomDonation = () => (
  <form action="//www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
    <input type="hidden" name="cmd" value="_donations" />
    <input type="hidden" name="business" value="FIXME - this needs to be the freeCodeCamp paypal email" />
    <input type="hidden" name="item_name" value="Donation to FreeCodeCamp" />
    <input type="hidden" name="currency_code" value="USD" />
    <button
      style={{
        backgroundColor: "white",
        border: "none",
        cursor: "pointer",
        textDecoration: "underline",
        color: "blue",
        padding: "0",
        margin: "8px 0",
      }}
      name="submit"
      type="submit"
    >
      Make a custom donation with PayPal
    </button>
  </form>
);

export default DonateView
