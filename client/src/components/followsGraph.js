import React, { Component } from "react";
import { VictoryBar, VictoryChart } from "victory";
import * as Api from "../functions/api";

class FollowsGraph extends Component {
  state = {
    data: [],
  };

  componentDidMount = () => {
    this.getFollowesFromServer();
  };

  getFollowesFromServer = async () => {
    let dataFromServer = await Api.callToServerFollowesFromServer();
    this.setState({ data: dataFromServer });
  };

  bulidData = (array) => {
    let arr = [];
    array.map((follow) => {
      let obj = { vacationId: follow.vacationId, followers: follow.userId };
      arr.push(obj);
    });
    this.setState({ data: arr });
    console.log(this.state.data);
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
