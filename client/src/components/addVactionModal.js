import React, { Component } from "react";
import * as Api from "../functions/api";
import Settings from "../functions/settings";
import socketIOClient from "socket.io-client";

class addVactionModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      description: "",
      destination: "",
      picture: [],
      fromDate: "",
      toDate: "",
      price: "",
      missingData: "",
    };
  }

  componentDidMount = () => {
    this.socket = socketIOClient(Settings.soketUrl);
  };

  /* this fun is for send data to soket chanel after change */
  sendSocket = (vacation) => {
    this.socket.emit("add vacation", vacation);
  };

  /* this fun update the state from the form data */
  onChange = (e) => {
    if (e.target.type == "file") {
      this.setState({ picture: e.target.files });
    } else {
      this.setState({ [e.target.name]: e.target.value });
    }
  };

  /* this fun is coming from admin.js and is for close the add vacation modal */
  closeBtn = () => {
    this.props.closeFun();
  };

  /* this fun bild a object  and   does a test, if the whole form fills a function: "callToServerAddVacation"
If not full writes in HTML that missing information  */
  onFormSubmit = async () => {
    const formData = new FormData();
    let arr = [...this.state.picture];
    for (let i = 0; i < arr.length; i++) {
      formData.append("uploads[]", arr[i], arr[i]["name"]);
    }
    let description = this.state.description;
    let destination = this.state.destination;
    let fromDate = String(this.state.fromDate);
    let toDate = String(this.state.toDate);
    let price = this.state.price;
    formData.append("description", description);
    formData.append("destination", destination);
    formData.append("fromDate", fromDate);
    formData.append("toDate", toDate);
    formData.append("price", price);

    if (
      this.state.description != "" &&
      this.state.destination != "" &&
      this.state.fromDate != "" &&
      this.state.toDate != "" &&
      this.state.price != "" &&
      arr.length != 0
    ) {
      let vacation = await Api.callToServerAddVacation(formData);
      this.sendSocket(vacation);
      this.closeBtn();
    } else {
      this.setState({
        missingData:
          "* All fields are required !! Please fill out the form and try again",
      });
    }
  };

  render() {
    return (
      <div>
        <div className="mt-3" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title ml-4">Vacation details</h5>
                <button
                  onClick={() => this.closeBtn()}
                  type="button"
                  className="close"
                >
                  X
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <label className="dateForm text-info">Description</label>
                  <input
                    className="mt-1"
                    type="text"
                    value={this.state.description}
                    name="description"
                    onChange={this.onChange}
                  ></input>
                  <br />
                  <label className="dateForm text-info">Destination</label>
                  <input
                    className="mt-1"
                    type="text"
                    value={this.state.destination}
                    name="destination"
                    onChange={this.onChange}
                  ></input>
                  <br />
                  <label className="dateForm text-info">From date</label>
                  <input
                    placeholder="from date"
                    className="mt-3"
                    type="date"
                    value={this.state.fromDate}
                    name="fromDate"
                    onChange={this.onChange}
                  ></input>
                  <br />
                  <label className="dateForm text-info">To date</label>
                  <input
                    className="mt-3"
                    type="date"
                    name="toDate"
                    value={this.state.toDate}
                    onChange={this.onChange}
                  ></input>
                  <br />
                  <label className="dateForm text-info"> Vacation Price </label>
                  <input
                    className="mt-1"
                    type="number"
                    value={this.state.price}
                    name="price"
                    onChange={this.onChange}
                  ></input>
                  <br />
                  <label className="dateForm text-info"> Upload picture </label>
                  <input
                    className="mt-1 text-center"
                    type="file"
                    name="myImage"
                    onChange={this.onChange}
                    multiple
                  />
                  <span className="missingData">{this.state.missingData}</span>
                  <div className="modal-footer row">
                    <button
                      onClick={() => this.onFormSubmit()}
                      type="button"
                      className="btn btn-primary float-left  d-inline"
                    >
                      Add Vacation
                    </button>
                    <button
                      onClick={() => this.closeBtn()}
                      type="button"
                      className="btn btn-secondary d-inline"
                    >
                      Close
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default addVactionModal;
