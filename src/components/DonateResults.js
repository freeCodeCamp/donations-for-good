import React from "react"

function DonateResults(props) {
  const { checkout, donation } = props
  const { error, pending, success } = checkout
  const { amount } = donation
  let msg = ""
  let bgClass = ""

  if (pending) {
    bgClass = "bg-lightest-blue"
    msg = "We are processing your donation..."
  }

  if (success) {
    bgClass = "bg-light-green"
    msg = `
    You are now donating $${amount / 100} monthly to freeCodeCamp.
    Thank you!
    `
  }

  if (error) {
    bgClass = "bg-light-red"
    msg = `
    We had trouble processing your donation:
    ${checkout.error}
    `
  }

  return (
    <section className={`pv2 ph3 max-500 ${bgClass}`}>
      <p className="lh-copy measure">{msg}</p>
    </section>
  )
}

export default DonateResults
