import React, { Component } from "react";
import "./EarthScene.css";
import * as THREE from "threejs-full-es6";
import Stats from "../../node_modules/three/examples/js/libs/stats.min.js";

/**
 *  Erdkugel texturiert mit OrbitControls und Weltraum als Skybox
 * 
 *  TODO: React Syntax verwenden + refactoring
 *  state(height, width) etc
 */

class EarthScene extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // General Variables
    var container, stats, controls;
    var camera, scene, renderer;
    var element, positionInfo, height, width;

    // Test: variable height und width des container elements für resizing
    element = document.getElementById("canvasContainer");
    positionInfo = element.getBoundingClientRect();
    height = window.innerHeight;
    width = positionInfo.width;

    console.log(height, width);

    const init = () => {
      container = this.refs.anchor;

      // Scene
      scene = new THREE.Scene();

      // Camera
      camera = new THREE.PerspectiveCamera(90, width / height, 1, 1000);
      camera.position.set(0, 0, 20);

      // Koordinatensystem (linke Hand), x=rot, y=grün, z=blau
      var axes = new THREE.AxesHelper(50);
      axes.position.set(0, 0, 0);
      scene.add(axes);

      // Renderer
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(width, height);
      container.appendChild(renderer.domElement);

      // Controls
      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.3;
      controls.zoomSpeed = 5;

      // TODO: Erdkugel
      var geometry = new THREE.SphereGeometry(5);
      var material = new THREE.MeshPhongMaterial({
        color: 0xaaaaaa,
        specular: 0x333333,
        shininess: 15
      });
      var sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);
    };

    // resizing
    window.addEventListener("resize", onWindowResize, false);

    function onWindowResize() {
      element = document.getElementById("canvasContainer");
      positionInfo = element.getBoundingClientRect();
      height = window.innerHeight;
      width = positionInfo.width;

      console.log(height, width);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    }

    // Loop
    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      render();
      //stats.update();
    }
    function render() {
      renderer.render(scene, camera);
    }

    // gameloop
    init();
    animate();
  }

  render() {
    return <div id="container" ref="anchor" />;
  }
}

export default EarthScene;
