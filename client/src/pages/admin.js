import React, { Component } from "react";
import { connect } from "react-redux";
import "../addVacationModal.css";
import AddVacationModal from "../components/addVactionModal";
import VacationCards from "../components/vacationsCards";
import { Link, Redirect } from "react-router-dom";

class Admin extends Component {
  state = {
    drowModal: "",
  };

  componentDidMount = () => {};

  /* this fun move to addVacationModal for close the modal */
  closeModal = () => {
    setTimeout(() => {
      this.setState({ drowModal: "" });
    }, 500);
  };

  /* this fun is drow the add vaction moadl to html (on click button) */
  addNewVaction = () => {
    this.setState({
      drowModal: <AddVacationModal fn={this.closeModal}></AddVacationModal>,
    });
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
      <div id="adminWarrper">
        {pageDirection}
        <h3 className="text-center pt-2" id="adminTitle">
          Hello Admin! <br /> Welcome to your management system
        </h3>
        <div>
          <div>
            <button
              id="followLink"
              type="button"
              className="btn btn-success mb-2"
            >
              <Link to="/graph">Click Here To Move To follows graph</Link>
            </button>
          </div>

          <button
            onClick={() => this.addNewVaction()}
            id="addVactionButton"
            type="button"
            className="btn btn-outline-info"
          >
            Click Here To Add a New Vacation
          </button>
        </div>
        <div>{this.state.drowModal}</div>
        <div>
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
