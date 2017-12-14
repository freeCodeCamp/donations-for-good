import React from "react"
import PropTypes from "prop-types"

const TemplateWrapper = ({ children }) => <main>{children()}</main>

TemplateWrapper.propTypes = {
  children: PropTypes.func
}

export default TemplateWrapper
