import React, { Component } from "react";
import "./App.css";
import EarthScene from "./apps3d/EarthScene";
import { Container, Grid } from "semantic-ui-react";

class App extends Component {
  render() {
    return (
      <div>
        <Container fluid>
          <Grid columns={2} style={{"marginBottom": 0, "marginTop": 0, "marginRight": 0, "marginLeft": 0}}>
            <Grid.Row style={{"paddingTop": 0, "paddingBottom": 0}}>
              <Grid.Column id="canvasContainer" style={{"paddingLeft": 0, "paddingRight": 0}} >
                <EarthScene />
              </Grid.Column>

              <Grid.Column style={{"paddingLeft": 0, "paddingRight": 0}}>
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
                commodo ligula eget dolor. Aenean massa strong. Cum sociis
                natoque penatibus et magnis dis parturient montes, nascetur
                ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu,
                pretium quis, sem. Nulla consequat massa quis enim. Donec pede
                justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim
                justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam
                dictum felis eu pede link mollis pretium. Integer tincidunt.
                Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate
                eleifend tellus. Aenean leo ligula, porttitor eu, consequat
                vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in,
                viverra quis, feugiat a, tellus. Phasellus viverra nulla ut
                metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam
                ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi.
              </Grid.Column>
            </Grid.Row>

          </Grid>
        </Container>
      </div>
    );
  }
}

export default App;
