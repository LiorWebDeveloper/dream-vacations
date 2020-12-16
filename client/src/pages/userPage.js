import React, { Component } from "react";
import "../login.css";
import { connect } from "react-redux";
import VacationCards from "../components/vacationsCards";
import { Redirect } from "react-router-dom";

class UserPage extends Component {
  componentDidMount = () => {
    this.getLoacalStorage();
  };

  /* this fun for set the uesr un the local storage */
  getLoacalStorage = () => {
    let userFromLoaclStorah = JSON.parse(localStorage.getItem("currentUser"));
    if (userFromLoaclStorah != null)
      this.props.updateLogInUsers(userFromLoaclStorah);
  };

  render() {
    let pageDirection = "";
    /* this fun is for check if non log in user or andmin is go to login page    */
    const direction = () => {
      if (this.props.loggedInUser == null) {
        pageDirection = <Redirect to="/" />;
      }
    };
    direction();
    return (
      <div>
        {pageDirection}
        <VacationCards />
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
    updateLogInUsers(value) {
      dispatch({
        type: "SetLoggedInUser",
        payload: value,
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserPage);
