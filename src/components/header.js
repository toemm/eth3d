import React, { Component } from "react";
import { Menu, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";
import logo from "../ressources/logo.png";

class Header extends Component {
  render() {
    return (
      <Menu id="header" borderless stackable>
        <Menu.Item>
          <Image size="mini" src={logo} />
        </Menu.Item>

        <Menu.Item header>Eth3D</Menu.Item>

        <Menu.Item>
          <Link to="/owner">Owner </Link>
        </Menu.Item>

        <Menu.Item>
          <Link to="/explore">Explore</Link>
        </Menu.Item>

        <Menu.Menu position="right">
          <Menu.Item>
            <Link to="/about">About</Link>
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }
}

export default Header;