import React, { Component } from "react";
import { connect } from "react-redux";
import EditVacationModal from "./editVacationModal";
import * as Api from "../functions/api";
import Settings from "../functions/settings";
import socketIOClient from "socket.io-client";

class VacationsCards extends Component {
  socket;

  constructor(props) {
    super(props);
    this.state = {
      drowEdit: "",
      followIcon: <i id={this.props.vacations.id} className="far fa-star"></i>,
      userId: null,
      vacations: [],
    };
  }

  componentDidMount = async () => {
    await this.getLoacalStorage();
    await this.getAllVacation(this.state.userId);
    this.setState({ vacations: this.props.vacations });
    this.markFollowOnFollowVacationsOnLoad();
    this.socket = socketIOClient(Settings.soketUrl);
    this.editVacationSoket();
    this.addVacationSoket();
    this.deleteVacationSoket();
  };

  /* this fun us for edit get vacation after edit from editVacationModel.js and do setstate */
  editVacationSoket = () => {
    this.socket.on("edit vacation", (vacation) => {
      let allVacations = [...this.state.vacations];
      let index = this.props.vacations.findIndex((v) => v.id === vacation.id);
      allVacations[index] = vacation;
      this.setState({ vacations: allVacations });
    });
  };

  /* this fun us for add get vacation after add from addVacationModel.js and do setstate */
  addVacationSoket = () => {
    this.socket.on("add vacation", (vacation) => {
      let allVacations = [...this.state.vacations];
      allVacations.push(vacation);
      this.setState({ vacations: allVacations });
    });
  };

  /* this fun us for delete get vacation after delete from this copmmpnent and do setstate */
  deleteVacationSoket = () => {
    this.socket.on("delete vacation", (id) => {
      let allVacations = [...this.state.vacations];
      let index = this.props.vacations.findIndex((v) => v.id === id);
      allVacations.splice(index, 1);
      this.setState({ vacations: allVacations });
    });
  };

  /* this fun is for send data to soket chanel after delete */
  sendVacationForDeleteSocket = (vacation) => {
    this.socket.emit("delete vacation", vacation);
  };

  /* this fun is for send data to soket chanel after delete */
  sendFollowsVacationsSocket = (followsVacation) => {
    this.socket.emit("follows vacation", followsVacation);
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

  /* this fun get all vacations from server and update the reducer */
  getAllVacation = async (userId) => {
    let vacations = await Api.getAllVacation(userId);
    this.setState({ vacations: vacations });
    this.props.SetVacation(vacations);
  };

  /* this fun is onclick fun on button in card. for delete vacation by id */
  deleteVacation = (e) => {
    Api.callToServerDeleteVacation(e);
    this.sendVacationForDeleteSocket(e);
  };

  colseEditModal = () => {
    this.setState({ drowEdit: "" });
  };

  addOrDeleteVacationToFollow = async (i, status) => {
    let obj = {
      userId: this.props.loggedInUser.id,
      vacationId: i,
    };
    let allFollowsVacations = await Api.callToServerAddOrDeleteFavoriteVacation(
      obj,
      `${Settings.GlobalURL}follows/${status}`
    );
    this.sendFollowsVacationsSocket(allFollowsVacations);
  };

  followOrNot = (e, i) => {
    //let vacations = [...this.props.vacations];
    let status = "";
    let btn = document.getElementById("i-" + e.target.id);
    if (e.target.checked == true) {
      status = "insertFollows";
      this.addOrDeleteVacationToFollow(e.target.id, status);
      btn.classList.remove("far");
      btn.classList.add("fas");
    } else {
      status = "deleteFollows";
      this.addOrDeleteVacationToFollow(e.target.id, status);
      btn.classList.remove("fas");
      btn.classList.add("far");
    }
  };

  /* this fun is to mark all the follows vacaitons on page load */
  markFollowOnFollowVacationsOnLoad = () => {
    this.props.vacations.map((vacation) => {
      let followBtn = document.getElementById("i-" + vacation.id);
      let checkboxBtn = document.getElementById(vacation.id);
      if (vacation.isFollow == true) {
        followBtn.classList.add("fas");
        checkboxBtn.checked = true;
      }
    });
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
    let drowCard = this.state.vacations.map((vacation, i) => {
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
                onChange={(e) => this.followOrNot(e, i)}
                type="checkbox"
                className="checkboxBtn"
              />
            </div>
          );
        }
      }
      let image = `${Settings.GlobalURL}uploads/${vacation.picture}`;
      return (
        <div key={i} className="col-xl-4 col-md-6">
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
