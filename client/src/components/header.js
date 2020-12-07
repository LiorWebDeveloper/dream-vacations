import React, { Component } from "react";
import Logo from "../images/logo.jpg";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

class Header extends Component {
  componentDidMount = () => {
    this.getLocalStorage();
  };

  /* this fun do log out for the user  and clane the local storag , also do set for loggedInUser in the reducer  */
  logOutUser = () => {
    this.props.logOutUser(null);
    localStorage.removeItem("currentUser");
  };

  /* this fun for get the user datiles from local storage and do set for loggedInUser in the reducer and direction for the user page */
  getLocalStorage = () => {
    let userFromLocalStorage = localStorage.getItem("currentUser");
    userFromLocalStorage != null
      ? this.props.logOutUser(JSON.parse(userFromLocalStorage))
      : this.props.logOutUser(null);
  };

  render() {
    /* this for Write down the full name of the loged in user  or guest near to the logout */
    let theName = "";
    this.props.loggedInUser != null
      ? (theName =
          this.props.loggedInUser.firstName +
          " " +
          this.props.loggedInUser.lastName)
      : (theName = "Guest");

    let arrow = <i className="fas fa-angle-double-right mx-2"></i>;

    return (
      <div id="headerWrapper" className="row mx-1">
        <div className="col-md-3 px-0">
          <img id="logo" src={Logo} alt="logo"></img>
        </div>

        <div id="hedaerText" className="col-md-6">
          <h1 className="text-center"> Lior Draem Vacations</h1>
          <h2 className="text-center">
            {" "}
            Choose a Vacation {arrow} Follow vacation {arrow} Stay Updated{" "}
          </h2>
        </div>

        <div
          id="userName"
          className="col-md-3 text-right mt-auto p-2 bd-highlight mb-1"
        >
          Hello {theName} |{" "}
          <Link id="logoutLink" onClick={() => this.logOutUser()} to="/">
            <span id="userNameText">
              Logout <i className="fas fa-sign-out-alt"></i>
            </span>
          </Link>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loggedInUser: state.loggedInUser,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logOutUser(value) {
      dispatch({
        type: "SetLoggedInUser",
        payload: value,
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
