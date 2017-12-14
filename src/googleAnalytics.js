import ReactGA from "react-ga"

ReactGA.initialize("UA-55446531-7", {
  debug: false,
  titleCase: false,
  gaOptions: {
    alwaysSendReferrer: true,
    forceSSL: true
  }
})

export default ReactGA
