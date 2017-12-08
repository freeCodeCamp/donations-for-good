const html = require('choo/html');
const donateButtons = require('./donateButtons');
const donateBitcoin = require('./donateBitcoin');
const donateResults = require('./donateResults');
const providerButtons = require('./providerButtons');

module.exports = donateView;

function donateView(state, emit) {
  const { pending, success, error } = state.checkout;
  const donateProcessed = pending || (success || error);
  return html`
    <div>
      <h5
        class="f4 mv0 color-neutral-80"
        >
        How much to donate monthly:
      </h5>
      ${donateButtons(state, emit)}
      <p></p>
      <h5
        class="f4 mv0 color-neutral-80"
        >
        How to donate:
      </h5>
      ${providerButtons(state, emit)}
      <br>
      <p class="lh-copy measure f5 mt4 mt0-ns">
        We receive donations in USD minus fees.
      </p>
      ${donateProcessed ? donateResults(state) : ''}
    </div>
  `;
}
