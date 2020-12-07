import React, { Component } from "react";
import { connect } from "react-redux";
import EditVacationModal from "./editVacationModal";
import * as Api from "../functions/api";
import Settings from "../functions/settings";
import socketIOClient from "socket.io-client";

class VacationsCards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drowEdit: "",
      followIcon: <i id={this.props.vacations.id} className="far fa-star"></i>,
      userId: null,
    };
  }

  componentDidMount = async () => {
    this.socket = socketIOClient(Settings.soketUrl);
    await this.getLoacalStorage();
    this.getAllVacation(this.state.userId);
  };

  getLoacalStorage = () => {
    let userFromLoaclStorah = JSON.parse(localStorage.getItem("currentUser"));
    if (userFromLoaclStorah != null) {
      this.setState({
        userId: userFromLoaclStorah.id,
      });
      this.props.updateLogInUsers(userFromLoaclStorah);
    }
  };

  /* this fun is for send data to soket chanel after change */
  sendSocket = (vacation) => {
    this.socket.emit("edit vacation", vacation);
  };

  /* this fun get all vacations from server and update the reducer */
  getAllVacation = async (userId) => {
    let vacation = await Api.getAllVacation(userId);
    this.sendSocket(vacation);
    this.props.SetVacation(vacation);
  };

  /* this fun is onclick fun on button in card. for delete vacation by id */
  deleteVacation = (e) => {
    Api.callToServerDeleteVacation(e);
    this.getAllVacation();
  };

  colseEditModal = () => {
    this.setState({ drowEdit: "" });
  };

  addVacationToFollow = (i) => {
    let obj = {
      userId: this.props.loggedInUser.id,
      vacationId: i,
    };
    Api.callToServerAddOrDeleteFavoriteVacation(
      obj,
      `${Settings.GlobalURL}follows/insertFollows`
    );
  };

  deleteVacationToFollow = (i) => {
    let obj = {
      userId: this.props.loggedInUser.id,
      vacationId: i,
    };
    Api.callToServerAddOrDeleteFavoriteVacation(
      obj,
      `${Settings.GlobalURL}follows/deleteFollows`
    );
  };

  followOrNot = (e) => {
    let btn = document.getElementById("i-" + e.target.id);
    if (e.target.checked == true) {
      this.addVacationToFollow(e.target.id);
      btn.classList.remove("far");
      btn.classList.add("fas");
    } else {
      this.deleteVacationToFollow(e.target.id);
      btn.classList.remove("fas");
      btn.classList.add("far");
    }
  };

  render() {
    let editVacation = (vacation) => {
      this.setState({
        drowEdit: (
          <EditVacationModal
            closeModal={this.colseEditModal}
            vacation={vacation}
          ></EditVacationModal>
        ),
      });
    };

    let tools = "";
    let deleteIcon = <i className="fas fa-trash-alt"> </i>;
    let editIcon = <i className="fas fa-edit"> </i>;
    console.log(this.props.vacations);
    let drowCard = this.props.vacations.map((vacation, i) => {
      if (this.props.loggedInUser != null) {
        if (this.props.loggedInUser.role == 1) {
          tools = (
            <span className="adminTools">
              <button
                onClick={() => this.deleteVacation(vacation.id)}
                type="button"
                className="btn ml-2"
              >
                {deleteIcon}
              </button>
              <button
                onClick={() => editVacation(vacation)}
                type="button"
                className="btn float-right mr-2"
              >
                {editIcon}
              </button>
            </span>
          );
        } else {
          tools = (
            <div className="userTools ml-2 mt-1">
              <i id={"i-" + vacation.id} className="far fa-star"></i>
              <input
                id={vacation.id}
                onChange={(e) => this.followOrNot(e)}
                type="checkbox"
                className="checkboxBtn"
              />
            </div>
          );
        }
      }
      let image = `${Settings.GlobalURL}uploads/${vacation.picture}`;
      return (
        <div className="col-xl-4 col-md-6">
          <div
            key={i}
            className="card text-info border-info my-2 mx-1 vacationCard"
          >
            {tools}
            <div className="card-header bg-transparent border-info text-center cardTitle">
              {vacation.destination} <br /> {vacation.description}
            </div>
            <div className="card-body text-info">
              <h5 className="card-title text-center">
                Only: {vacation.price}$
              </h5>
              <img className="imageCard" src={image}></img>
            </div>
            <div className="card-footer bg-transparent border-info text-center">
              From: {vacation.fromDate} <br /> To: {vacation.toDate}
            </div>
          </div>
        </div>
      );
    });

    return (
      <div>
        <div> {this.state.drowEdit} </div>

        <div id="cardRow" className="row">
          {drowCard}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    vacations: state.vacations,
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

export default connect(mapStateToProps, mapDispatchToProps)(VacationsCards);
