const html = require('choo/html');
// const raw = require('choo/html/raw');

module.exports = function providerButtons(state, emit) {
  // Amazon Pay specific stuff commented out for release

  // capture amazon pay button html if it is rendered, we should
  // reuse this html instead of asking the amazon script to
  // render it again. That causes the button todisappear/reappear
  // on each render
  // this will likely break when amazon changes is checkout.js

  /*
  * TODO:(@Bouncey) find a less fragile way of keeping the amazon pay
  * button on screen
  */
  // if (!state.amazonButton) {
  //   state.amazonButton =
  //     document.getElementById('OffAmazonPaymentsWidgets0') &&
  //     document.getElementById('OffAmazonPaymentsWidgets0').outerHTML;
  // }
  //   <li class="dib mr2 mb2 full-width">
  //   <button
  //     onclick=${() => {
  //       emit('checkout-method', 'amazon');
  //       emit('checkout');
  //       return;
  //     }}
  //     class="${'mt2 f6 f4-ns tc b dib pv3 ph3 link inv ' +
  //       'color-neutral-80 ba b--green full-width'}">
  //       <div id='AmazonPayButton'>
  //       ${state.amazonButton ? raw(state.amazonButton) : ''}
  //       </div>
  //   </button>
  // </li>


  return html`
  <div class="donate-button-list-wrapper">
    <ul class="list pl0 mb0 payment-methods">
      <li class="dib mr2 mb2 full-width">
        <button
          onclick=${() => {
            emit('checkout-method', 'stripe');
            emit('checkout');
            return;
          }}
          class="${'mt2 f6 f4-ns tc b dib pv3 ph3 link inv ' +
            'color-neutral-80 ba b--green full-width'}"
            >
            Credit or Debit Card
        </button>
      </li>
      <li class="dib mr2 mb2 full-width">
      <form
      action="//www.paypal.com/cgi-bin/webscr"
      method="post"
      onsubmit="ga(
        'send',
        {
          hitType: 'event',
          eventCategory: 'donation',
          eventAction: 'click',
          eventLabel: 'paypal',
          eventValue: ${state.donation.amount / 100}
        }
      );"
      target="_blank"
      >
      <input
        name="cmd"
        type="hidden"
        value="_s-xclick"
      />
      <input
        name="hosted_button_id"
        type="hidden"
        value="${state.paypal.buttonValue}"
      />
      <button
        class="${'mt2 f6 f4-ns tc b dib pv3 ph3 link inv ' +
          'color-neutral-80 ba b--green full-width'}"
        name="submit"
        onclick=${e => {
          if (!state.donation.amount) {
            e.preventDefault();
          }
          emit('checkout-method', 'paypal');
          emit('checkout');
          return;
        }}
        type="submit"
        >
        <img
          alt='pay with paypal'
          src='/images/payment-logos/pp-logo-200px.png'
          title='Pay with PayPal'
        />
      </button>
    </form>>
      </li>
    </ul>
  </div>
  `;
};
