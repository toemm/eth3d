import React, { Component } from "react";
import "../EarthScene.css";
import * as THREE from "threejs-full-es6";
import Stats from "../../node_modules/three/examples/js/libs/stats.min.js";
import earthmap4k from "../ressources/earthmap1k.jpg";
import bumpmap4k from "../ressources/earthbump4k.jpg";
import specmap4k from "../ressources/earthspec4k.jpg";
import cloudmap from "../ressources/earthcloudmap.png";
import galaxy from "../ressources/galaxy_starfield.png";

/**
 *  Erdkugel texturiert mit OrbitControls und Weltraum als Skybox
 *
 *  TODO: React Syntax verwenden + refactoring
 *  state(height, width, mouseX, mouseY)
 */

class EarthScene extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    ////////////////////////////////////////////////////////////
    //      General Variables     //
    ////////////////////////////////////////////////////////////
    var container, stats, controls, loader;
    var camera, scene, renderer;
    var element, positionInfo, height, width;
    var geometry, material, intersected;
    var onRenderFcts = [];

    element = document.getElementById("canvasContainer");
    positionInfo = element.getBoundingClientRect();
    height = window.innerHeight;
    width = positionInfo.width;

    var mouse = new THREE.Vector2();
    var raycaster = new THREE.Raycaster();
    var groupObjects = new THREE.Group();

    var mouseDown = 0;

    ////////////////////////////////////////////////////////////
    //      Setup     //
    ////////////////////////////////////////////////////////////

    const init = async () => {
      container = this.refs.anchor;

      // Scene
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x000000);

      // Camera
      camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 100);
      camera.position.set(2, 2, 2);

      // Renderer
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(width, height);
      container.appendChild(renderer.domElement);

      // Controls
      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.3;
      controls.zoomSpeed = 5;

      ////////////////////////////////////////////////////////////
      //      Erdkugel und Wolken Objekte     //
      ////////////////////////////////////////////////////////////

      // Texturen laden
      loader = new THREE.TextureLoader();
      var earthMapTexture = await loader.load(earthmap4k);
      var bumpMapTexture = await loader.load(bumpmap4k);
      var specMapTexture = await loader.load(specmap4k);
      var earthCloudTexture = await loader.load(cloudmap);
      var galaxyTexture = await loader.load(galaxy);

      // Erdkugel
      geometry = new THREE.SphereGeometry(0.5, 32, 32);
      material = new THREE.MeshPhongMaterial({
        map: earthMapTexture,
        bumpMap: bumpMapTexture,
        bumpScale: 0.05,
        shininess: 5,
        specularMap: specMapTexture,
        specular: new THREE.Color("grey")
      });
      var containerEarth = new THREE.Mesh(geometry, material);
      containerEarth.name = "containerEarth";
      groupObjects.add(containerEarth);

      // Wolken
      geometry = new THREE.SphereGeometry(0.51, 32, 32);
      material = new THREE.MeshPhongMaterial({
        map: earthCloudTexture,
        side: THREE.DoubleSide,
        opacity: 0.8,
        transparent: true
      });
      var cloudMesh = new THREE.Mesh(geometry, material);
      cloudMesh.name = "cloudMesh";
      containerEarth.add(cloudMesh); // Cloudmesh als Child von eartMesh -> bewegen sich zusammen

      // Erdkugel+Wolken hinzufügen
      scene.add(groupObjects);
      containerEarth.position.set(0, 0, 0);

      // Erdkugel + Wolken Rotationen
      onRenderFcts.push((delta, now) => {
        containerEarth.rotation.y += 1 / 4 * delta;
      });
      onRenderFcts.push((delta, now) => {
        cloudMesh.rotation.y += 1 / 2 * delta;
      });

      // Hintergrund Galaxie
      geometry = new THREE.SphereGeometry(90, 32, 32);
      material = new THREE.MeshBasicMaterial({
        map: galaxyTexture,
        side: THREE.BackSide
      });
      var galaxyMesh = new THREE.Mesh(geometry, material);
      galaxyMesh.name = "galaxyMesh";
      scene.add(galaxyMesh);

      ////////////////////////////////////////////////////////////
      //      Licht    //
      ////////////////////////////////////////////////////////////
      scene.add(new THREE.AmbientLight(0x222222));
      var light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(5, 5, 5);
      scene.add(light);

      ////////////////////////////////////////////////////////////
      //      Helpers    //
      ////////////////////////////////////////////////////////////

      // FPS, MS stats window
      stats = new Stats();
      container.appendChild(stats.dom);

      // Licht Richtung
      var helper = new THREE.DirectionalLightHelper(light, 1);
      scene.add(helper);

      // Koordinatensystem (linke Hand), x=rot, y=grün, z=blau
      var axes = new THREE.AxesHelper(50);
      axes.position.set(0, 0, 0);
      scene.add(axes);

      // Window resizing, rerender
      window.addEventListener("resize", onWindowResize, false);

      function onWindowResize() {
        element = document.getElementById("canvasContainer");
        positionInfo = element.getBoundingClientRect();
        height = positionInfo.height;
        width = positionInfo.width;

        //console.log(height, width);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
      }

      // Mouse Controls
      document.body.onmousedown = () => {
        ++mouseDown;
      }; // Check ob mouse gerade gedrückt wird
      document.body.onmouseup = () => {
        --mouseDown;
      };

      // Kommunizieren mit UI falls Objekt angeklickt
      document.addEventListener(
        "mousedown",
        event => {
          event.preventDefault();

          element = document.getElementById("canvasContainer");
          positionInfo = element.getBoundingClientRect();
          height = positionInfo.height;
          width = positionInfo.width;

          mouse.x = event.clientX / width * 2 - 1;
          mouse.y = -(event.clientY / height) * 2 + 1;

          // Auswählen von Objekten (picking)
          raycaster.setFromCamera(mouse, camera);
          var intersects = raycaster.intersectObjects(
            groupObjects.children,
            true
          );

          if (intersects.length > 0) {
            if (mouseDown) {
              this.props.onPlanetClick(intersects[0].object.parent.name);
              console.log("click");
            }
          }
        },
        false
      );

      // Objekte einfärben bei mouseover
      document.addEventListener(
        "mousemove",
        event => {
          event.preventDefault();

          // Aktuelle width und height abfragen
          element = document.getElementById("canvasContainer");
          positionInfo = element.getBoundingClientRect();
          height = positionInfo.height;
          width = positionInfo.width;

          mouse.x = event.clientX / width * 2 - 1;
          mouse.y = -(event.clientY / height) * 2 + 1;

          // Auswählen von Objekten (picking)
          raycaster.setFromCamera(mouse, camera);
          var intersects = raycaster.intersectObjects(
            groupObjects.children,
            true
          );

          // Mit Mauszeiger ausgewähltes Objekt färben
          // TODO: eigentlich wird das Wolken Mesh als erstes angewählt
          // aber auch die Erdkugel soll eingefärbt werden
          if (intersects.length > 0) {
            // Test ob neues ausgewähltes Objekt dem Alten entspricht
            if (intersected !== intersects[0]) {
              // Falls nicht, Farbe des alten Objekts auf Standard setzen
              if (intersected) {
                intersected.object.material.color.set(0xffffff); // white default
                intersected.object.parent.material.color.set(0xffffff);
              }
              // altes Objekt überschreiben und neu einfärben
              intersected = intersects[0];
              intersected.object.material.color.set(0xdaf7a6);
              intersected.object.parent.material.color.set(0xdaf7a6);
            }
            // Cursor Style ändern
            document.body.style.cursor = "pointer";
          } else if (intersected) {
            // Falls kein Objekt ausgewählt wurde
            // altes ausgewähltes Objekt zurücksetzen und Standardfarbe einfärben
            intersected.object.material.color.set(0xffffff);
            intersected.object.parent.material.color.set(0xffffff);
            intersected = null;

            // Cursor Style zurücksetzen
            document.body.style.cursor = "auto";
          }
        },
        false
      );
      onRenderFcts.push((delta, now) => {
        //camera.position.x += (mouse.x*5 - camera.position.x) * (delta*3);
        //camera.position.y += (mouse.y*5 - camera.position.y) * (delta*3);
        //camera.lookAt(scene.position);
      });
    };

    ////////////////////////////////////////////////////////////
    //      Render Loop    //
    ////////////////////////////////////////////////////////////
    var lastTimeMsec = null;

    onRenderFcts.push(() => {
      renderer.render(scene, camera);
    });

    // Initialisierung
    init();

    function animate(nowMsec) {
      requestAnimationFrame(animate);

      // measure time
      lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60;
      var deltaMsec = Math.min(200, nowMsec - lastTimeMsec);
      lastTimeMsec = nowMsec;

      stats.update();
      controls.update();

      // alle Update fncts
      onRenderFcts.forEach(onRenderFct => {
        onRenderFct(deltaMsec / 1000, nowMsec / 1000);
      });
    }

    // Start render loop
    requestAnimationFrame(animate);
  }

  render() {
    return <div id="container" ref="anchor" />;
  }
}

export default EarthScene;
