import React, { Component } from "react";
import PropTypes from "prop-types";

const propTypes = {
  children: PropTypes.node
};

const defaultProps = {};

class DefaultFooter extends Component {
  render() {
    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        {/* <span>
          <a href="http://dev.bloomsmobility.com">BloomsMobility</a> &copy; 2019
          BloomsMobility
        </span> */}
      </React.Fragment>
    );
  }
}

DefaultFooter.propTypes = propTypes;
DefaultFooter.defaultProps = defaultProps;

export default DefaultFooter;
