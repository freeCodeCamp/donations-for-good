const html = require('choo/html');

module.exports = function donateResults(state) {
  var msg = '';
  var bgClass = '';

  if (state.checkout.pending) {
    bgClass = 'bg-lightest-blue';
    msg = 'We are processing your donation...';
  }

  if (state.checkout.success) {
    bgClass = 'bg-light-green';
    msg = `
      You are now donating $${state.checkout.amount / 100} monthly to freeCodeCamp.
      Thank you!
    `;
  }

  if (state.checkout.error) {
    bgClass = 'bg-light-red';
    msg = `
      We had trouble processing your donation:
      ${state.checkout.error}
    `;
  }

  return html`
    <section class="pv2 ph3 max-500 ${bgClass}">
      <p class="lh-copy measure">
        ${msg}
      </p>
    </section>
  `;
};
