import React from "react"
import preloads from './head/preloads';
import metaAndStyleSheets from './head';


let stylesStr
if (process.env.NODE_ENV === "production") {
  try {
    stylesStr = require("!raw-loader!../public/styles.css")
  } catch (e) {
    console.log(e)
  }
}

class HTML extends React.Component {
  render() {
    let css
    if (process.env.NODE_ENV === "production") {
      css = (
        <style
          dangerouslySetInnerHTML={{ __html: stylesStr }}
          id="gatsby-inlined-css"
        />
      )
    }
    // these props are comping from gatsby, we do not need to worry about them
    /* eslint-disable react/prop-types */
    const clientId =
      "amzn1.application-oa2-client.b8925ec1200b4911bffc00d90e2d19f1"
    return (
      <html {...this.props.htmlAttributes}>
        <head>
          {preloads}
          {metaAndStyleSheets}
          <link
            rel="stylesheet"
            href="https://unpkg.com/tachyons/css/tachyons.min.css"
          />
          {this.props.headComponents}
          {css}
        </head>
        <body {...this.props.bodyAttributes}>
          {this.props.preBodyComponents}
          <div
            dangerouslySetInnerHTML={{ __html: this.props.body }}
            id="___gatsby"
            key={"body"}
          />
          <script async="async" src="https://checkout.stripe.com/checkout.js" />
          <script src="/js/onPageLoad.js" />
          <script
            async="async"
            src="https://static-na.payments-amazon.com/OffAmazonPayments/us/sandbox/js/Widgets.js"
          />
          {this.props.postBodyComponents}
        </body>
      </html>
    )
    /* eslint-enable react/prop-types */
  }
}

HTML.displayName = "HTML"

module.exports = HTML
