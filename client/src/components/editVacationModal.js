import React, { Component } from "react";
import Settings from "../functions/settings";
import socketIOClient from "socket.io-client";
import * as Api from "../functions/api";

class EditVacationModal extends Component {
  constructor(props) {
    super(props);
    let vacation = this.props.vacation;
    this.state = {
      id: vacation.id,
      description: vacation.description,
      destination: vacation.destination,
      picture: "",
      orignalPicture: vacation.picture[0],
      fromDate: vacation.fromDate,
      toDate: vacation.toDate,
      price: vacation.price,
      missingData: "",
      drowCard: "",
    };
  }

  componentDidMount = () => {
    this.socket = socketIOClient(Settings.soketUrl);
  };

  /* this fun is for send data to soket chanel after change */
  sendSocket = (vacation) => {
    this.socket.emit("edit vacation", vacation);
  };

  /* When the client finishes edit a vacation and presses the SAVE button then The FUN  builds an array from the form and sends it to the server for editing */
  onFormSubmit = async () => {
    const formData = new FormData();
    let picture = "";
    /* here do check if the client uploade new picture or not */
    if (this.state.picture != "") {
      let arr = [...this.state.picture];
      console.log("EditVacationModal -> arr", arr);
      for (let i = 0; i < arr.length; i++) {
        formData.append("uploads[]", arr[i], arr[i]["name"]);
      }
    } else {
      picture = this.state.orignalPicture;
      formData.append("files", picture);
    }
    let description = this.state.description;
    let destination = this.state.destination;
    let fromDate = String(this.state.fromDate);
    let toDate = String(this.state.toDate);
    let price = this.state.price;
    let id = this.state.id;
    formData.append("description", description);
    formData.append("destination", destination);
    formData.append("fromDate", fromDate);
    formData.append("toDate", toDate);
    formData.append("price", price);
    formData.append("id", id);
    let vacations = await Api.updateVacation(formData);
    let vacation = this.findtVacationToSendSoket(vacations, id);
    this.sendSocket(vacation);
    this.closeBtn();
  };

  /* this fun for fin the vacatuon we edit and send only this vacation object to soket */
  findtVacationToSendSoket = (vacations, id) => {
    let index = vacations.findIndex((vacation) => vacation.id === id);
    return vacations[index];
  };

  onChange = (e) => {
    if (e.target.type == "file") {
      this.setState({ picture: e.target.files });
    } else {
      this.setState({ [e.target.name]: e.target.value });
    }
  };

  /* this for close the model (after send or jest cancel) */
  closeBtn = () => {
    this.props.closeModal();
  };
  render() {
    let vacation = this.props.vacation;
    let image = `${Settings.GlobalURL}uploads/${vacation.picture}`;
    this.state.drowCard = (
      <div className="card text-info border-info my-3 vacationCard">
        <form>
          <div className="card-header bg-transparent border-info text-center cardTitle">
            <span>Edit this vacation </span>
            <label className="dateForm text-info">Edit Destination</label>
            <input
              name="destination"
              onChange={this.onChange}
              type="text"
              placeholder={vacation.destination}
            ></input>{" "}
            <br />
            <label className="dateForm text-info">Edit Description</label>
            <input
              name="description"
              onChange={this.onChange}
              type="text"
              placeholder={vacation.description}
            ></input>
          </div>
          <div className="card-body text-info">
            <h5 className="card-title text-center">
              <label className="dateForm text-info">Edit Price</label>
              <input
                name="price"
                onChange={this.onChange}
                type="number"
                placeholder={vacation.price + "$"}
              ></input>
            </h5>
            <label className="dateForm text-info"> Upload picture </label>
            <input
              className="mt-1 text-center"
              type="file"
              name="myImage"
              onChange={this.onChange}
              multiple
            />
            <img className="imageCard" src={image}></img>
          </div>
          <div className="card-footer bg-transparent border-info text-center">
            <label className="dateForm text-info">
              Edit From Date : {vacation.fromDate}
            </label>
            <input name="fromDate" onChange={this.onChange} type="date"></input>
            <label className="dateForm text-info">
              Edit To Date : {vacation.toDate}
            </label>
            <input name="toDate" onChange={this.onChange} type="date"></input>
            <div className="row mt-3">
              <button
                onClick={() => this.onFormSubmit()}
                type="button"
                className="btn btn-success  col-7"
              >
                Save changes
              </button>
              <button
                onClick={() => this.closeBtn()}
                type="button"
                className="btn btn-danger ml-1 col-4"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    );
    return <div>{this.state.drowCard}</div>;
  }
}
export default EditVacationModal;
