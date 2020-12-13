import React, { Component } from "react";
import { connect } from "react-redux";
import "../addVacationModal.css";
import AddVacationModal from "../components/addVactionModal";
import VacationCards from "../components/vacationsCards";
import { Link, Redirect } from "react-router-dom";

class Admin extends Component {
  state = {
    drowModal: "",
    pageDirection: "",
  };

  /* this fun move to addVacationModal for close the modal */
  closeModal = () => {
    setTimeout(() => {
      this.setState({ drowModal: "" });
    }, 300);
  };

  /* this fun is drow the add vaction moadl to html (on click button) */
  addNewVaction = () => {
    this.setState({
      drowModal: (
        <AddVacationModal closeFun={this.closeModal}></AddVacationModal>
      ),
    });
  };

  render() {
    /* this fun is for check if non log in user or andmin is go to login page    */
    const direction = () => {
      if (this.props.loggedInUser == null) {
        this.setState({ pageDirection: <Redirect to="/" /> });
      }
    };
    let goToGraph = () => {
      this.setState({ pageDirection: <Redirect to="/graph" /> });
    };

    direction();
    return (
      <div id="adminWarrper">
        {this.state.pageDirection}
        <div className="d-flex justify-content-around mt-2 pt-3">
          <button
            onClick={() => this.addNewVaction()}
            id="addVactionButton"
            type="button"
            className="btn btn-outline-info pl-4"
          >
            Add a New Vacation
          </button>
          <h3 className="text-center pt-2" id="adminTitle">
            Hello Admin! <br /> Welcome to your management system
          </h3>
          <button
            id="followLink"
            type="button"
            className="btn btn-outline-info"
            onClick={() => goToGraph()}
          >
            Follows graph
          </button>
        </div>

        <div>{this.state.drowModal}</div>
        <div className="my-3">
          <VacationCards />
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
