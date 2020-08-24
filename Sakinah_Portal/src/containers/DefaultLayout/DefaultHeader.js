import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import {
  // Badge,
  // UncontrolledDropdown,
  // DropdownItem,
  // DropdownMenu,
  // DropdownToggle,
  Nav,
  NavItem
} from "reactstrap";
import PropTypes from "prop-types";
import axios from "axios";
import {
  // AppAsideToggler,
  // AppNavbarBrand,
  AppSidebarToggler
} from "@coreui/react";
// import logo from "../../assets/img/brand/logo.svg";
// import sygnet from "../../assets/img/brand/sygnet.svg";

const propTypes = {
  children: PropTypes.node
};

const defaultProps = {};

class DefaultHeader extends Component {
  submit = () => {
    confirmAlert({
      title: "Are you Sure",
      message: "Proceed to logout.",
      buttons: [
        {
          label: "Yes",
          onClick: () => this.logout()
        },
        {
          label: "No",
          onClick: () => {}
        }
      ]
    });
  };
  logout() {
    delete axios.defaults.headers.common["token"];
    localStorage.removeItem("token");
    window.location.href = "/#/login";
  }
  render() {
    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppSidebarToggler className="d-md-down-none" display="lg" />

        <Nav className="d-md-down-none" navbar>
          <NavItem className="px-3">
            <NavLink to="/dashboard" className="nav-link">
              Dashboard
            </NavLink>
          </NavItem>
        </Nav>
        <Nav className="ml-auto" navbar>
          <NavItem className="d-md-down-none">
            <i className="icon-logout" onClick={this.submit}></i>
          </NavItem>
        </Nav>
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
