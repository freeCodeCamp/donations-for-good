const html = require('choo/html');

module.exports = function amazonModal() {
  return html`
  <div id="modal-content">
    <h1>Hello Modal</h1>
    <div id="walletWidgetDiv"></div>
  </div>
  `;
};
