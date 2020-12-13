import React, { Component } from "react";
import "../login.css";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import * as Api from "../functions/api";

class Login extends Component {
  newUserObj = {};
  state = {
    firstName: "",
    lastName: "",
    mail: "",
    password: "",
    logInMail: "",
    logInPassword: "",
    incorrectMailOrPassword: "",
    isError: {
      firstName: "",
      lastName: "",
      mail: "",
      password: "",
    },
  };

  componentDidMount = () => {
    document.querySelector(".img__btn").addEventListener("click", function () {
      document.querySelector(".cont").classList.toggle("s--signup");
    });
  };

  /* this fun for collect the string from the form and update the state  */
  inputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  /* this fun for set the uesr un the local storage */
  setLoacalStorage = (user) => {
    localStorage.setItem("currentUser", JSON.stringify(user));
  };

  /* this fun call the server To know if it is admin or reguler user and update the reducer */
  logInSubmit = async (status) => {
    let resulteFromServer = "";
    let obj = {
      mail: "",
      password: "",
    };
    if (status == 1) {
      obj.mail = this.state.logInMail;
      obj.password = this.state.logInPassword;
    } else if (status == 0) {
      obj.mail = this.state.mail;
      obj.password = this.state.password;
    }
    /* this fun call to server and check if the email and the passworad is correct or incorrect */
    resulteFromServer = await Api.logInAfterSubmit(obj);
    if (resulteFromServer != "incorrect") {
      this.props.updateLogInUsers(resulteFromServer);
      this.setLoacalStorage(this.props.loggedInUser);
    } else
      this.setState({
        incorrectMailOrPassword: "Email or password is incorrect",
      });
  };

  /* this fun is for validate the input email address  */
  ValidateEmail(mail) {
    if (
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        mail
      )
    ) {
      return true;
    }
    return false;
  }

  /* this fun is for do validation for the sing up form befor send to the server and insert note where is a problem  */
  checkForm(newUser) {
    let flag = true;
    console.log(newUser);
    let mail = this.ValidateEmail(newUser.mail);
    let Error = {
      firstName: "",
      lastName: "",
      password: "",
      mail: "",
    };
    this.setState({ isError: Error });
    if (newUser.firstName.length < 2) {
      Error.firstName = "Enter at least 2 characters";
      this.setState({ isError: Error });
      flag = false;
    }
    if (newUser.lastName.length < 2) {
      Error.lastName = "Enter at least 2 characters";
      this.setState({ isError: Error });
      flag = false;
    }
    if (newUser.password < 6) {
      Error.password = "Enter at least 6 characters";
      this.setState({ isError: Error });
      flag = false;
    }
    if (mail == false) {
      Error.mail = "You have entered an invalid email address!";
      this.setState({ isError: Error });
      flag = false;
    }
    return flag;
  }

  /* this fun is call to validate function and if it is all ok  we  call to server and insert a new user   */
  createNewUser = async () => {
    let Error = {
      firstName: "",
      lastName: "",
      password: "",
      mail: "",
    };
    let validate = this.checkForm(this.newUserObj);
    if (validate != false) {
      let resulte = await Api.createNewUser(this.newUserObj);
      if (resulte != "mailExists") this.logInSubmit(0);
      else {
        Error.mail = "The email address is already exists";
        this.setState({ isError: Error });
      }
    }
  };

  /* this fun Collects the data from the sign up from and go to createNewUser function to call to server and create new user */
  SignUpSubmit = async () => {
    this.newUserObj = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      mail: this.state.mail,
      password: this.state.password,
      role: 0,
    };
    this.createNewUser();
  };

  render() {
    /* this fun is for know after the log in the right direction of page is it is admin go to admin page if it is user go to the user page  */
    let pageDirection = "";
    const direction = () => {
      if (this.props.loggedInUser != null) {
        if (this.props.loggedInUser.role == 1)
          pageDirection = <Redirect to="/admin" />;
        else if (this.props.loggedInUser.role == 0)
          pageDirection = <Redirect to="/user" />;
      }
    };
    direction();

    return (
      <div>
        {pageDirection}
        <div className="cont">
          <div className="form sign-in">
            <h2>Welcome back,</h2>
            <label>
              <span>E-Mail</span>
              <input
                onChange={(e) => this.inputChange(e)}
                name="logInMail"
                type="email"
              />
            </label>
            <label>
              <span>Password</span>
              <input
                onChange={(e) => this.inputChange(e)}
                name="logInPassword"
                type="password"
              />
            </label>
            <div id="incorrectLogIn">{this.state.incorrectMailOrPassword}</div>
            <button
              onClick={() => this.logInSubmit(1)}
              type="button"
              className="submit mt-2"
            >
              Sign In
            </button>
          </div>
          <div className="sub-cont">
            <div className="img">
              <div className="img__text m--up">
                <h2>New here?</h2>
                <p>Sign up and discover At the most lucrative vacations!</p>
              </div>
              <div className="img__text m--in">
                <h2>One of us?</h2>
                <p>
                  If you already has an account, just sign in. We've missed you!
                </p>
              </div>
              <div className="img__btn">
                <span className="m--up">Sign Up</span>
                <span className="m--in">Sign In</span>
              </div>
            </div>
            <div className="form sign-up">
              <h2>Time to feel like home,</h2>
              <form className="was-validated">
                <label>
                  <span>First Name</span>
                  <input
                    className="is-valid"
                    onChange={(e) => this.inputChange(e)}
                    name="firstName"
                    type="text"
                    required
                  />
                  <small className="isErr">
                    {this.state.isError.firstName}
                  </small>
                  <div
                    style={{ fontSize: "0.5rem" }}
                    className="invalid-feedback "
                  >
                    *Required!
                  </div>
                </label>
                <label>
                  <span>Last Name</span>
                  <input
                    className="is-valid"
                    onChange={(e) => this.inputChange(e)}
                    name="lastName"
                    type="text"
                    required
                  />
                  <small className="isErr ">
                    {this.state.isError.lastName}
                  </small>
                  <div
                    style={{ fontSize: "0.5rem" }}
                    className="invalid-feedback"
                  >
                    *Required!
                  </div>
                </label>
                <label>
                  <span>E-Mail</span>
                  <input
                    className="is-valid"
                    onChange={(e) => this.inputChange(e)}
                    name="mail"
                    type="email"
                    required
                  />
                  <div
                    style={{ fontSize: "0.5rem" }}
                    className="invalid-feedback"
                  >
                    *Required!
                  </div>
                  <small className="form-text text-muted isErr">
                    {this.state.isError.mail}
                  </small>
                </label>
                <label>
                  <span>Password</span>
                  <input
                    className="is-valid"
                    onChange={(e) => this.inputChange(e)}
                    name="password"
                    type="password"
                    required
                  />
                  <small className="isErr">{this.state.isError.password}</small>
                  <div
                    style={{ fontSize: "0.5rem" }}
                    className="invalid-feedback"
                  >
                    *Required!
                  </div>
                </label>
                <button
                  onClick={() => this.SignUpSubmit()}
                  id="singUpButton"
                  type="button"
                  className="submit mt-2"
                >
                  Sign Up
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    users: state.users,
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

export default connect(mapStateToProps, mapDispatchToProps)(Login);
