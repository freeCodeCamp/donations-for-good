var html = require('choo/html');
var donate = require('./donate');
const fccLogo = require('./fccLogo');

function donateView(state, emit) {
  return html`
  <article class="cf ph3 ph5-ns pv4 color-neutral relative">
      <header class="fn fl-ns w-70-l pr4-ns">
        <h1 class="f3 mb3 mt0 lh-title">${fccLogo()}</h1>
        <div class="fn fl-ns">
          <h2>From freeCodeCamp founder Quincy Larson</h2>
          <hr>
          <p>freeCodeCamp is one of the biggest learning communities on the internet.</p>
          <p>Together, we've created thousands of videos, articles, and coding challenges you can learn from.</p>
          <p>We also have a network of thousands of local study groups worldwide.</p>
          <p>But all of this is run by a tiny nonprofit. And we need your donations to survive.</p>
          <p>We're just getting started. Help this community reach its full potential. Set up a monthly donation you can afford.</p>
          <br>
          <p>Thanks,</p>
          <br>
          <p><strong>Quincy Larson</strong></p>
          <p>freeCodeCamp Founder</p>
        </div>
      </header>
      <div class="fn fl-ns w-30-l">
        <div class="pt1 mt2">
          ${donate(state, emit)}
        </div>
        <h5 class="f4 mv0 color-neutral-80">Where your donation goes</h5>
        <br>
        <p class="lh-copy measure f5 mt4 mt0-ns">
          <strong>Technology:</strong> Servers, bandwidth, development, and maintenance. freeCodeCamp is one of the top technology websites in the world, and it runs on a fraction of what other top websites spend.
        </p>
        <p class="lh-copy measure f5 mt4 mt0-ns">
          <strong>People and Projects:</strong> Other top websites have thousands of employees. We only have 3 staff to support a wide variety of projects, making your donation a great investment in a highly-efficient nonprofit organization.
        </p>
      </div>
  </article>
  `;
}

module.exports = donateView;
