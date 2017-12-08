var html = require('choo/html');
var choo = require('choo');
var log = require('choo-log');
var css = require('sheetify');
var main = require('./components/main');
const amazonModal = require('./components/donate/amazonModal');
const { loadStripeCheckout, stripeCheckout } = require('./checkouts/stripe');
// const {
//   loadAmazonCheckout,
//   handleAmazonCheckout,
//   renderAmazonElements
// } = require('./checkouts/amazon');
const { paypalButtonValues } = require('./checkouts/paypal');

const handleCheckout = {
  // amazon: handleAmazonCheckout,
  /* no-op for paypal, handled via form */
  paypal: () => {},
  stripe: stripeCheckout
};

css('tachyons');
css('dat-colors');
css('./app.css');

var app = choo();
app.use(log());
// app.use(loadAmazonCheckout);
app.use(loadStripeCheckout);
// app.use(renderAmazonElements);
app.use(handleDonate);
app.route('/', mainView);
app.route('/*', mainView);
app.mount('body');

function mainView(state, emit) {
  return html`
    <body class="color-neutral">
      <main id="page-wrap">
      ${main(state, emit)}
      </main>
      <div id='modal'>
        ${amazonModal(state, emit)}
      </div>
    </body>
  `;
}

function handleDonate(state, emitter) {
  state.checkout = {};
  state.donation = {};
  state.paypal = {};
  state.amazon = {};
  emitter.on('DOMContentLoaded', function() {
    // select $35 on page load
    emitter.emit('amount', 3500);
  });

  emitter.on('toggleBitcoinView', function() {
    state.bitcoinView = !state.bitcoinView;
    emitter.emit('render');
  });
  emitter.on('amount', function(value) {
    state.donation.amount = value;
    state.paypal.buttonValue = paypalButtonValues[value];
    state.checkout.error = null;
    emitter.emit('render');
  });
  emitter.on('checkout-method', function(method) {
    state.donation.checkoutMethod = method;
  });
  emitter.on('checkout', function() {
    if (!state.donation.amount) {
      state.checkout.error = 'Please select an amount to donate';
      emitter.emit('render');
      return;
    }
    state.checkout = Object.assign(state.checkout, {
      amount: state.donation.amount,
      // force reset vals
      success: null,
      error: null,
      pending: true
    });
    emitter.emit('log:info', state.checkout);
    emitter.emit('render');
    const { checkoutMethod } = state.donation;
    handleCheckout[checkoutMethod](state, emitter);
  });
}
