import React, { Component } from "react";
import "./Cube.css";
import * as THREE from "threejs-full-es6";
import Stats from "../../node_modules/three/examples/js/libs/stats.min.js";

class Cube extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // General Variables
    var container, stats, controls;
    var camera, scene, renderer;

    // Als Objekt, um this zu binden
    const init = () => {
      // Container
      container = this.refs.anchor;

      // Scene
      scene = new THREE.Scene();

      // Camera
      scene.background = new THREE.Color(0xf0f0f0);
      camera = new THREE.PerspectiveCamera(
        90,
        window.innerWidth / window.innerHeight,
        1,
        10000
      );
      camera.position.set(0, 250, -2000);
      scene.add(camera);

      // Lightning
      //scene.add(new THREE.AmbientLight(0xf0f0f0));
      var light = new THREE.SpotLight(0xffffff, 1);
      light.position.set(0, 1500, 0);
      light.castShadow = true;

      // Shadows
      light.shadow = new THREE.LightShadow(
        new THREE.PerspectiveCamera(100, 1, 200, 2000) // Bereich in dem Schatten geworfen werden (Frustum)
      );
      light.shadow.bias = -0.000222; // Reduziert Artefakte
      light.shadow.mapSize.width = 1024; // Schattenqualität
      light.shadow.mapSize.height = 1024;
      scene.add(light);

      // Boden
      var planeGeometry = new THREE.PlaneGeometry(2000, 2000); // width, height
      planeGeometry.rotateX(-Math.PI / 2);
      var planeMaterial = new THREE.ShadowMaterial({ opacity: 0.4 }); // Lichtdurchlässigkeit 0 transparent -> 1 undurchlässig
      var plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.position.y = 0; // Verschieben -200 in y-Richtung (nach unten)
      plane.receiveShadow = true; // Boden wirft Schatten
      scene.add(plane);

      // Grid einblenden
      var helper = new THREE.GridHelper(2000, 100); // 1. Größe des Grids, 2.Anzahl Kacheln pro Reihe
      helper.position.y = -1; // Verschiebung y Richtung (über Boden)
      helper.material.opacity = 0.5; // Dicke des Grids
      helper.material.transparent = true; // Transparenz (ob Lichtquelle durchgelassen wird)
      scene.add(helper);

      // Koordiantensystem (linke Hand), x=rot, y=grün, z=blau
      var axes = new THREE.AxesHelper(3000);
      axes.position.set(0, 0, 0);
      scene.add(axes);

      // Renderer
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.shadowMap.enabled = true;
      container.appendChild(renderer.domElement);

      // FPS, MS stats window
      stats = new Stats();
      container.appendChild(stats.dom);

      // Controls
      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.3; // Dämpfungsfaktor für Kamera
    };

    // Loop
    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      render();
      stats.update();

    }
    function render() {
      renderer.render(scene, camera);
    }

    // gameloop
    init();
    animate();
  }

  render() {
    return (
      <div>
        <div ref="anchor" />
        Cube
      </div>
    );
  }
}

export default Cube;
