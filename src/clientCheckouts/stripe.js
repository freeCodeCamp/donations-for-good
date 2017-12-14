import xhr from "xhr"
import ReactGA from "../googleAnalytics"

import fccPuckLogo from "../../static/images/fcc_puck600.png"

export function loadStripeKey(cb) {
  return xhr(
    {
      uri: "/api/stripe-key",
      json: true
    },
    function(err, resp, body) {
      if (err || resp.statusCode !== 200) {
        return cb(err)
      }
      return cb(null, body.key)
    }
  )
}

export function stripeCheckout({
  keys: { stripeKey },
  donation,
  checkout,
  isProduction
}) {
  if (!stripeKey) {
    console.error("No Stripe Key detected")
  }
  // StripeCheckout is loaded as global variable with checkout.js
  const checkoutHandler = window.StripeCheckout.configure({
    key: stripeKey,
    locale: "auto"
  })
  checkoutHandler.open({
    name: "freeCodeCamp.org",
    description: `$${donation.amount / 100} Donation to freeCodeCamp.org`,
    image: fccPuckLogo,
    panelLabel: "Donate",
    bitcoin: false,
    amount: donation.amount,
    billingAddress: false,
    closed: function() {
      if (!checkout.pending) {
        checkout.update("pending", false)
      }
    },
    token: function handleStripeCharge(token) {
      checkout.update("pending", true)
      xhr(
        {
          uri: "/api/charge-stripe",
          method: "POST",
          body: { token: token, amount: donation.amount },
          json: true,
          headers: { "Content-Type": "application/json" }
        },
        function(err, resp, body) {
          checkout.update("pending", false)
          if (err || resp.statusCode !== 200) {
            checkout.update("error", body.error || "Error processing donation")
            if (err) {
              checkout.update("error", err.message)
            }
            ReactGA.event({
              category: `${isProduction ? "" : "test-"}stripe-payment`,
              action: "fail",
              label: `$${donation.amount / 100}`
            })
          } else {
            checkout.update("success", true)
            ReactGA.event({
              category: `${isProduction ? "" : "test-"}stripe-payment`,
              action: "success",
              label: `$${donation.amount / 100}`
            })
          }
        }
      )
    }
  })
}
