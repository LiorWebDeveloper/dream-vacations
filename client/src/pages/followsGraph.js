import React, { Component } from "react";
import { VictoryBar, VictoryChart } from "victory";
import * as Api from "../functions/api";
import Settings from "../functions/settings";
import socketIOClient from "socket.io-client";

class FollowsGraph extends Component {
  socket;
  state = {
    data: [],
  };

  componentDidMount = () => {
    this.getFollowesFromServer();
    this.socket = socketIOClient(Settings.soketUrl);
    this.getFollowsVacationsFormSoket();
  };

  getFollowesFromServer = async () => {
    let dataFromServer = await Api.callToServerFollowesFromServer();
    this.setState({ data: dataFromServer });
    console.log("dataFromServer", dataFromServer);
  };

  getFollowsVacationsFormSoket = () => {
    this.socket.on("follows vacation", (followsVacation) => {
      console.log("followsVacation", followsVacation);
      this.setState({ data: followsVacation });
    });
  };

  render() {
    let dataForChart = [];
    this.state.data.map((item) => {
      let obj = {
        x: "V-ID:" + item.vacationId,
        y: item.followers,
      };
      dataForChart.push(obj);
    });

    return (
      <div id="chartWrapper">
        <VictoryChart domainPadding={25}>
          <VictoryBar data={dataForChart} />
        </VictoryChart>
      </div>
    );
  }
}

export default FollowsGraph;

/* 
  bulidData = (array) => {
    let arr = [];
    array.map((follow) => {
      let obj = { vacationId: follow.vacationId, followers: follow.userId };
      arr.push(obj);
    });
    this.setState({ data: arr });
    console.log(this.state.data);
  };
 */