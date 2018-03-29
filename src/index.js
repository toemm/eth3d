import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import EarthScene from "./scenes/EarthScene";
import { Container, Grid } from "semantic-ui-react";
import registerServiceWorker from './registerServiceWorker';





class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cickedObjectName: "asdf",
    };
  }

  componentDidMount() {

  }

  onPlanetClick = planetObjectName => {
    this.setState({ clickedObjectName: planetObjectName });
  }



  render() {
    return (
      <div>
        <Container fluid>
          <Grid columns={2} style={{"marginBottom": 0, "marginTop": 0, "marginRight": 0, "marginLeft": 0}}>
            <Grid.Row style={{"paddingTop": 0, "paddingBottom": 0}}>
              <Grid.Column id="canvasContainer" style={{"paddingLeft": 0, "paddingRight": 0}} width={10}>
                <EarthScene onPlanetClick={this.onPlanetClick}/>
              </Grid.Column>
              <h3>Name: {this.state.clickedObjectName}</h3>
              <Grid.Column style={{"paddingLeft": 0, "paddingRight": 0}} width={6}>
              </Grid.Column>
            </Grid.Row>

          </Grid>
        </Container>
      </div>
    );
  }
}


ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

