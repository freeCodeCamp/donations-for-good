import React from "react"
import ReactGA from "../googleAnalytics"

class DonateAmounts extends React.Component {
  constructor(props) {
    super(props)
    this.buttonAmounts = [300, 1000, 3500, 5000, 25000]
    this.handleClick = this.handleClick.bind(this)
    this.isActive = this.isActive.bind(this)
    this.renderButtons = this.renderButtons.bind(this)
  }

  handleClick(e) {
    e.preventDefault()
    const { isProduction, updateAmount } = this.props
    updateAmount(e.target.id)
    ReactGA.event({
      category: `${isProduction ? "" : "test-"}donation-amount`,
      action: "click",
      label: `amount-button $${parseInt(e.target.id, 10) / 100}`,
      value: parseInt(e.target.id, 10) / 100
    })
  }

  isActive(id) {
    return this.props.donationAmount === id
  }

  renderButtons() {
    return this.buttonAmounts.map(amount => (
      <li className="dib mr2 mb2" key={`donate-${amount}`}>
        <a
          href=""
          id={amount}
          onClick={this.handleClick}
          className={
            "mt2 f6 f4-ns tc b dib pv3 ph3 link inv " +
            "color-neutral-80 ba b--green value " +
            `${this.isActive(amount) ? "active" : ""}`
          }
        >
          {`$${amount / 100}`}
        </a>
      </li>
    ))
  }

  render() {
    return (
      <div className="donate-button-list-wrapper">
        <ul className="list pl0 mb0">{this.renderButtons()}</ul>
      </div>
    )
  }
}

DonateAmounts.displayName = "DonateAmounts"

export default DonateAmounts
