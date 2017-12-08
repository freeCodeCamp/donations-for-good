const html = require('choo/html');

module.exports = function donateBitcoin() {
  // TODO:@QuincyLarson CoinBase key
  return html`
    <div class="donate-button-list-wrapper">
      <ul class="list pl0 mb0">
        <li class="dib mr2 mb2 bitcoin-button full-width">
          <a
            class="${'mt2 f6 f4-ns tc b dib pv3 ph3 link inv ' +
              'color-neutral-80 ba b--green'}"'
            href="${'https://twitter.com/freeCodeCamp/status/' +
              '904506721405730816'}"
            target="_blank"
            >
            See our cryptocurrency wallet info
          </a>
        </li>
      </ul>
    </div>
  `;
};
