import React, { Component } from "react";
import "./App.css";
import Cube from "./apps3d/Cube";

class App extends Component {
  render() {
    return (
      <div className="App-intro">
        <Cube />
      </div>
    );
  }
}

export default App;
