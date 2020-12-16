import React, { Component } from "react";
import { VictoryBar, VictoryChart, VictoryLabel } from "victory";
import * as Api from "../functions/api";
import Settings from "../functions/settings";
import socketIOClient from "socket.io-client";
import { Redirect } from "react-router-dom";

class FollowsGraph extends Component {
  socket;
  state = {
    data: [],
    direction: "",
  };

  componentDidMount = () => {
    this.getFollowesFromServer();
    this.socket = socketIOClient(Settings.soketUrl);
    this.getFollowsVacationsFormSoket();
  };

  /* this fun call to server and get all follows vacations from DB */
  getFollowesFromServer = async () => {
    let dataFromServer = await Api.callToServerFollowesFromServer();
    this.setState({ data: dataFromServer });
  };

  /* this fun conect to soket and get follows vacations after the user mark or unmark follow vacation and do setstate  */
  getFollowsVacationsFormSoket = () => {
    this.socket.on("follows vacation", (followsVacation) => {
      this.setState({ data: followsVacation });
    });
  };

  /* this for on click btn for go back to all vacations card */
  backToAdminPage = () => {
    this.setState({ direction: <Redirect to="/admin" /> });
  };

  render() {
    let dataForChart = [];
    this.state.data.map((item) => {
      let obj = {
        x: `Id:${item.vacationId} `,
        y: item.followers,
      };
      dataForChart.push(obj);
    });

    if (dataForChart.length > 0) {
      return (
        <div id="chartWrapper">
          {this.state.direction}

          <div className="d-flex bd-highlight">
            <h2 className="adminTitle p-2 w-100 bd-highlight pl-5 ">
              Hello Admin! <br /> On this page you can see the number of
              followers each vacation has
            </h2>
            <button
              onClick={() => this.backToAdminPage()}
              type="button"
              className="btn btn-outline-info mt-2 p-2 flex-shrink-1 bd-highlight adminButton"
            >
              Back to all Vacations
            </button>
          </div>
          <VictoryChart domainPadding={{ x: 20 }}>
            <VictoryBar
              data={dataForChart}
              labels={({ datum }) => datum.y}
              style={{
                data: { fill: "gray" },
              }}
              events={[
                {
                  target: "data",
                  eventHandlers: {
                    onClick: () => {
                      return [
                        {
                          target: "data",
                          mutation: (props) => {
                            const fill = props.style && props.style.fill;
                            return fill === "black"
                              ? null
                              : { style: { fill: "green" } };
                          },
                        },
                      ];
                    },
                  },
                },
              ]}
              labelComponent={<VictoryLabel dy={30} />}
            />
          </VictoryChart>
        </div>
      );
    } else {
      return (
        <div id="chartWrapper" className="my-5">
          {this.state.direction}
          <div className="d-flex bd-highlight">
            <h2 className="adminTitle p-2 w-100 bd-highlight pl-5 ">
              Hello Admin! <br /> No data for display. Still no user is
              following a vacation
            </h2>
            <button
              onClick={() => this.backToAdminPage()}
              type="button"
              className="btn btn-outline-info p-2 flex-shrink-1 bd-highlight adminButton"
            >
              Back to all Vacations
            </button>
          </div>
        </div>
      );
    }
  }
}
export default FollowsGraph;
