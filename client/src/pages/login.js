import React, { Component } from "react";
import "../login.css";
import { connect } from "react-redux";
import Axios from "axios";
import { Redirect } from "react-router-dom";
import Settings from "../functions/settings";

class Login extends Component {
  newUserObj = {};

  state = {
    firstName: "",
    lastName: "",
    mail: "",
    password: "",
    logInMail: "",
    logInPassword: "",
    mailErr: "",
    incorrectMailOrPassword: "",
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

    try {
      await Axios.post(`${Settings.GlobalURL}users/getUserByMail`, obj).then(
        (response) => {
          if (response.data != "incorrect") {
            this.props.updateLogInUsers(response.data);
            this.setLoacalStorage(this.props.loggedInUser);
          } else {
            this.setState({
              incorrectMailOrPassword: "Email or password is incorrect",
            });
          }
        }
      );
    } catch (e) {
      alert("one it worng");
      console.log(e);
    }
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
    this.setState({ mailErr: "You have entered an invalid email address!" });
    return false;
  }

  /* this fun do validation for thr form befor send  and if all OK it is send to the server */
  createNewUser = async () => {
    let mail = this.ValidateEmail(this.newUserObj.mail);
    if (
      this.newUserObj.firstName != "" &&
      this.newUserObj.lastName != "" &&
      this.newUserObj.password != "" &&
      mail != false
    ) {
      try {
        await Axios.post(
          `${Settings.GlobalURL}users/insertUser`,
          this.newUserObj
        ).then((response) => {
          if (response.data != "mailExists") {
            alert("it is done");
            this.logInSubmit(0);
          } else {
            this.setState({ mailErr: "this Email address is olrady exists" });
          }
        });
      } catch (e) {
        console.log(e);
        alert("There is a problem with the server, please try again later");
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
    /* this fun is for know after the log in the right direction of page   */
    let pageDirection = "";
    const direction = () => {
      if (this.props.loggedInUser != null) {
        if (this.props.loggedInUser.role == 1) {
          /*           this.props.setIsAdmin(true);
           */ pageDirection = <Redirect to="/admin" />;
        } else if (this.props.loggedInUser.role == 0) {
          pageDirection = <Redirect to="/user" />;
        }
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
                  <small id="emailHelp" className="form-text text-muted">
                    {this.state.mailErr}
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

    /*     setIsAdmin(value) {
      dispatch({
        type: "setIfIsAdmin",
        payload: value,
      });
    },
 */
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
