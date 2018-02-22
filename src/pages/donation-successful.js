import React from 'react';
import Link from 'gatsby-link';
import ReactGA from '../googleAnalytics';

import fccLogo from '../../static/images/FreeCodeCamplogo.svg';

class DonationSuccessful extends React.Component {
  componentDidMount() {
    ReactGA.pageview(window.location.pathname + window.location.search);
    ReactGA.event({
      category: 'donation-outcome',
      action: 'callback-url',
      label: 'success',
      nonInteraction: true
    });
  }
  render() {
    return (
      <div className="cf ph3 ph5-ns pv4 color-neutral relative">
        <div className="fn fl-ns w-100-l pr4-ns">
          <header>
            <Link to="/">
              <h1 className="f3 mb3 mt0 lh-title">
                <img
                  alt="freeCodeCamp logo"
                  src={fccLogo}
                  title="freeCodeCamp logo"
                />
              </h1>
            </Link>
          </header>
          <h1 className="f3 mb3 mt0 lh-title tc">Success!</h1>
          <h3 className="f4 mv0 color-neutral-80 tc">
            Thank you so much for supporting our nonprofit by setting up your
            monthly donation.
          </h3>
          <br />
          <h3 className="f4 mv0 color-neutral-80 tc">
            You can close this tab.
          </h3>
        </div>
      </div>
    );
  }
}

DonationSuccessful.displayName = 'DonationSuccessful';

export default DonationSuccessful;
