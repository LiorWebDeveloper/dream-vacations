import React, { Component } from "react";
import "../login.css";
import { connect } from "react-redux";
import VacationCards from "../components/vacationsCards";
import { Redirect } from "react-router-dom";
import socketIOClient from "socket.io-client";
import Settings from "../functions/settings";

class UserPage extends Component {
  logInUserId = 0;
  socket;

  componentDidMount = () => {
    this.socket = socketIOClient(Settings.soketUrl);
    this.socket.on("edit vacation", (vacations) => {
      this.props.SetVacation(vacations);
    });
    this.getLoacalStorage();
  };

  /* this fun for set the uesr un the local storage */
  getLoacalStorage = () => {
    let userFromLoaclStorah = JSON.parse(localStorage.getItem("currentUser"));
    if (userFromLoaclStorah != null) {
      this.logInUserId = userFromLoaclStorah.id;
      this.props.updateLogInUsers(userFromLoaclStorah);
    }
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
    SetVacation(value) {
      dispatch({
        type: "SetVacation",
        payload: value,
      });
    },
    updateLogInUsers(value) {
      dispatch({
        type: "SetLoggedInUser",
        payload: value,
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserPage);
