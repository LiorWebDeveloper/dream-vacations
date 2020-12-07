import React, { Component } from "react";
import {
  VictoryBar,
  VictoryChart,
} from "victory";
import Axios from "axios";

class FollowsGraph extends Component {
  state = {
    data: [],
  };

  componentDidMount = () => {
    this.getFollowesFromServer();
  };

  getFollowesFromServer = async () => {
    try {
      await Axios.get(`http://localhost:4000/follows/getAllFollows`).then(
        (response) => {
          /*  this.bulidData(response.data); */
          this.setState({ data: response.data });
          console.log(this.state.data);
        }
      );
    } catch (e) {
      console.log(e);
    }
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
