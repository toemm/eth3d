import React, { Component } from "react";
import * as three from "three";

class SpinningCube extends Component {
  componentDidMount() {
    const { width, height } = this.props;
    const scene = new three.Scene();
    const camera = new three.PerspectiveCamera(75, width / height, 1, 500);
    const renderer = new three.WebGLRenderer();
    renderer.setSize(width, height);

    // this.refs liefert das DOM Component (hier: div)
    // renderer.domElement liefert canvas Element, das angehängt wird
    this.refs.anchor.appendChild(renderer.domElement);

    // Cube
    var geometry = new three.BoxGeometry(1, 1, 1);
    var material = new three.MeshBasicMaterial({ color: 0x0ff00 });
    const cube = new three.Mesh(geometry, material);
    scene.add(cube);

    //Line
    material = new three.LineBasicMaterial({ color: 0x0000ff });
    geometry = new three.Geometry();
    geometry.vertices.push(new three.Vector3(-10, 0, 0));
    geometry.vertices.push(new three.Vector3(0, 10, 0));
    geometry.vertices.push(new three.Vector3(10, 0, 0));
    const line = new three.Line(geometry, material);
    scene.add(line);

    camera.position.set( 0, 0, 100 );
    //camera.position.z = 5;

    function gameLoop() {
      requestAnimationFrame(gameLoop);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    }

    gameLoop();
  }

  render() {
    const { width, height } = this.props;

    // Ref liefert Handle auf Components direkt oder bei HTML Components auf das DOM-Element
    // Ist verfügbar sofort, nachdem Component gemountet wurde
    return (
      <div
        ref="anchor"
        style={{ width: width, height: height, margin: "0 auto" }}
      />
    );
  }
}

export default SpinningCube;
