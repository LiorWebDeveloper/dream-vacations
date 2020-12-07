import React, { Component } from "react";
import Login from "./login";
import FollowsGraph from "../components/followsGraph";
import UserPage from "./userPage";
import Admin from "./admin";
import { Route } from "react-router-dom";

class Index extends Component {
  render() {
    return (
      <div id="indexWrapper">
        <Route path="/" exact component={Login} />
        <Route path="/user" component={UserPage} />
        <Route path="/admin" component={Admin} />
        <Route path="/graph" component={FollowsGraph} />
      </div>
    );
  }
}

export default Index;
