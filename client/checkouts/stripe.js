const xhr = require('xhr');
const load = require('load-script2');

exports.loadStripeCheckout = function loadStripeCheckout(state, emitter) {
  load('https://checkout.stripe.com/checkout.js', function(err) {
    if (err) {
      return emitter.emit('log:error', err);
    }

    return xhr(
      {
        uri: '/api/stripe-key',
        json: true
      },
      function(err, resp, body) {
        emitter.emit('log:debug', body);
        if (err || resp.statusCode !== 200) {
          return emitter.emit('log:error', 'Error loading stripe');
        }

        state.stripeKey = body.key;
        state.stripeLoaded = true;
        emitter.emit('stripeLoaded');
        emitter.emit('log:info', 'loaded stripe checkout.js');
        return null;
      }
    );
  });
};

exports.stripeCheckout = function stripeCheckout(state, emitter) {
  if (!state.stripeLoaded) {
    emitter.once('stripeLoaded', function() {
      emitter.emit('checkout');
    });
    return;
  }
  // StripeCheckout is loaded as global variable with checkout.js
  const checkoutHandler = window.StripeCheckout.configure({
    key: state.stripeKey,
    locale: 'auto'
  });
  checkoutHandler.open({
    name: 'freeCodeCamp.org',
    description: `$${state.checkout.amount / 100} Donation to freeCodeCamp.org`,
    image: 'images/fcc_puck600.png',
    panelLabel: 'Donate',
    bitcoin: false,
    amount: state.checkout.amount,
    billingAddress: false,
    closed: function() {
      if (!state.checkout.chargePending) {
        state.checkout.pending = false;
        emitter.emit('render');
      }
    },
    token: function handleStripeCharge(token) {
      state.checkout.chargePending = true;
      xhr(
        {
          uri: '/api/charge-stripe',
          method: 'POST',
          body: { token: token, amount: state.checkout.amount },
          json: true,
          headers: { 'Content-Type': 'application/json' }
        },
        function(err, resp, body) {
          state.checkout.pending = false;
          state.checkout.chargePending = false;
          if (err || resp.statusCode !== 200) {
            state.checkout.error = body.error || 'Error processing donation';
            emitter.emit('log:error', state.checkout.error);
            if (err) {
              emitter.emit('log:error', err);
            }
          } else {
            state.checkout.success = true;
            emitter.emit('log:debug', resp);
          }
          emitter.emit('render');
        }
      );
    }
  });
};
