import React, { Component } from "react";
import { Segment } from "semantic-ui-react";

class Footer extends Component {
  render() {
    return (
      <Segment id="footer" raised secondary textAlign="center">
        <a href="http://google.com" target="_blank">
          Website
        </a>{" "}
        |{" "}
        <a href="http://google.com" target="_blank">
          Twitter
        </a>{" "}
        |{" "}
        <a href="http://google.com" target="_blank">
          Contract
        </a>{" "}
        |{" "}
        <a href="http://google.com" target="_blank">
          GitHub
        </a>
      </Segment>
    );
  }
}

export default Footer;
