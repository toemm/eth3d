import React, { Component } from "react";
import "../Cube.css";
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
      camera.position.set(25, 40, 20);
      scene.add(camera);

      // Lightning
      //scene.add(new THREE.AmbientLight(0xf0f0f0));
      var light = new THREE.PointLight(0xffffff, 1, 100, 2);
      light.position.set(10, 20, 10);
      light.castShadow = true;

      // Shadows
      light.shadow.camera.near = 0.5;
      light.shadow.camera.far = 50;
      light.shadow.camera.fov = 90;

      light.shadow.mapSize.width = 64; // Schattenqualität
      light.shadow.mapSize.height = 64;
      scene.add(light);

      // Shadow Camera Helper
      var sphereSize = 10;
      var helper = new THREE.PointLightHelper(light, sphereSize, 0x232720);
      scene.add(new THREE.CameraHelper(light.shadow.camera));
      scene.add(helper);

      // Boden
      var planeGeometry = new THREE.PlaneGeometry(1000, 1000); // width, height
      planeGeometry.rotateX(-Math.PI / 2);
      var planeMaterial = new THREE.ShadowMaterial({ opacity: 0.4 }); // Lichtdurchlässigkeit 0 transparent -> 1 undurchlässig
      var plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.position.y = 0; // Verschieben -200 in y-Richtung (nach unten)
      plane.receiveShadow = true; // Boden wirft Schatten
      plane.castShadow = false;
      scene.add(plane);

      // Grid einblenden
      var helper = new THREE.GridHelper(1000, 1000); // 1. Größe des Grids, 2.Anzahl Kacheln pro Reihe
      helper.position.y = 0; // Verschiebung y Richtung (über Boden)
      helper.material.opacity = 1; // Dicke des Grids
      helper.material.transparent = false; // Transparenz (ob Lichtquelle durchgelassen wird)
      scene.add(helper);

      // Koordiantensystem (linke Hand), x=rot, y=grün, z=blau
      var axes = new THREE.AxesHelper(50);
      axes.position.set(0, 0, 0);
      scene.add(axes);

      // Renderer
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      // renderer.setClearColor(0x4d8e28, 1);
      renderer.shadowMap.enabled = true;
      container.appendChild(renderer.domElement);

      // FPS, MS stats window
      stats = new Stats();
      container.appendChild(stats.dom);

      // Controls
      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.3; // Dämpfungsfaktor für Kamera
      controls.zoomSpeed = 5;

      // Boxes in Scene
      var cube = new THREE.Mesh(
        new THREE.BoxGeometry(10, 10, 10),
        new THREE.MeshPhongMaterial({ 
          color: 0x156289,
          emissive: 0x072534,
          side: THREE.DoubleSide,
          flatShading: true,
         })
      );
      cube.castShadow = true;
      cube.receiveShadow = false;
      scene.add(cube);
      cube.position.set(5, 5, 5);

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
