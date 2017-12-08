const html = require('choo/html');

function isActive(state, id) {
  return state.donation.amount === id;
}

module.exports = function donateButtons(state, emit) {
  return html`
  <div class="donate-button-list-wrapper">
  <ul class="list pl0 mb0">
    <li class="dib mr2 mb2">
      <a
        href=""
        id="300"
        onclick=${() => {
          emit('amount', 300);
        }}
        class="${'mt2 f6 f4-ns tc b dib pv3 ph3 link inv ' +
          'color-neutral-80 ba b--green value '}
          ${isActive(state, 300) ? 'active' : ''}">
          $3
      </a>
    </li>
    <li class="dib mr2 mb2">
      <a
        href=""
        id="1000"
        onclick=${() => {
          emit('amount', 1000);
        }}
        class="${'mt2 f6 f4-ns tc b dib pv3 ph3 link inv ' +
          'color-neutral-80 ba b--green value'}
          ${isActive(state, 1000) ? 'active' : ''}">
          $10
      </a>
    </li>
    <li class="dib mr2 mb2">
      <a
        href=""
        id="3500"
        onclick=${() => {
          emit('amount', 3500);
        }}
        class="${'mt2 f6 f4-ns tc b dib pv3 ph3 link inv ' +
          'color-neutral-80 ba b--green value'}
          ${isActive(state, 3500) ? 'active' : ''}">
          $35
      </a>
    </li>
    <li class="dib mr2 mb2">
      <a
        href=""
        id="5000"
        onclick=${() => {
          emit('amount', 5000);
        }}
        class="${'mt2 f6 f4-ns tc b dib pv3 ph3 link inv ' +
          'color-neutral-80 ba b--green value'}
          ${isActive(state, 5000) ? 'active' : ''}">
          $50
      </a>
    </li>
    <li class="dib mr2 mb2">
      <a
        href=""
        id="25000"
        onclick=${() => {
          emit('amount', 25000);
        }}
        class="${'mt2 f6 f4-ns tc b dib pv3 ph3 link inv ' +
          'color-neutral-80 ba b--green value'}
          ${isActive(state, 25000) ? 'active' : ''}">
          $250
      </a>
    </li>
  </ul>
  </div>
`;
};
