import React, { Component } from "react";
import ReactDOM from "react-dom";
import "./style.css";
import Canvas from "./components/canvas";
import { Segment, Dimmer, Loader } from "semantic-ui-react";
import registerServiceWorker from "./registerServiceWorker";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Explore from "./components/explore";
import Owner from "./components/owner";
import About from "./components/about";
import Header from "./components/header";
import Footer from "./components/footer";

/* TODO: alle CSS style Objekte in .css files einbinden
 * Komponenten zusammenfassen in React Components
*/

class App extends Component {
  state = {
    clickedObjectName: "asdf",
    canvasLoading: true
  };

  componentDidMount() {}

  onPlanetClick = planetObjectName => {
    this.setState({ clickedObjectName: planetObjectName });
  };

  onDoneLoading = loading => {
    this.setState({ canvasLoading: loading });
  };

  render() {
    return (
      <div id="app-container">
        <div id="canvas">
          <Segment id="canvasSegment" basic>
            <Dimmer active={this.state.canvasLoading}>
              <Loader
                disabled={!this.state.canvasLoading}
                content="Loading scene..."
              />
            </Dimmer>
            <Canvas
              onPlanetClick={this.onPlanetClick}
              onDoneLoading={this.onDoneLoading}
            />
          </Segment>
        </div>

        <div id="right">
          <Header />

          <div id="content">
            <Switch>
              <Route
                exact
                path="/"
                render={() => (
                  <Explore clickedPlanetName={this.state.clickedObjectName} />
                )}
              />

              <Route exact path="/owner" render={() => <Owner />} />

              <Route exact path="/about" render={() => <About />} />

              <Route
                exact
                path="/:explore"
                render={() => (
                  <Explore clickedPlanetName={this.state.clickedObjectName} />
                )}
              />
            </Switch>
          </div>

          <Footer />
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
registerServiceWorker();
