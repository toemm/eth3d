import React, { Component } from "react";
import "../HelloWorld3D.css";
import checkerboard from "../images/checkerboard.jpg";

// https://github.com/stemkoski/stemkoski.github.com/blob/master/Three.js/HelloWorld.html

class HelloWorld3D extends Component {
  componentDidMount() {
    // standard global variables
    var container, scene, camera, renderer, controls, stats;
    var keyboard = new window.THREEx.KeyboardState();
    var clock = new window.THREE.Clock();
    // custom global variables
    var cube;

    ///////////////
    // FUNCTIONS //
    ///////////////

    const init = () => {
      ///////////
      // SCENE //
      ///////////
      scene = new window.THREE.Scene();
      ////////////
      // CAMERA //
      ////////////

      // set the view size in pixels (custom or according to window size)
      // var SCREEN_WIDTH = 400, SCREEN_HEIGHT = 300;
      var SCREEN_WIDTH = window.innerWidth,
        SCREEN_HEIGHT = window.innerHeight;
      // camera attributes
      var VIEW_ANGLE = 45,
        ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT,
        NEAR = 0.1,
        FAR = 20000;
      // set up camera
      camera = new window.THREE.PerspectiveCamera(
        VIEW_ANGLE,
        ASPECT,
        NEAR,
        FAR
      );
      // add the camera to the scene
      scene.add(camera);
      // the camera defaults to position (0,0,0)
      // 	so pull it back (z = 400) and up (y = 100) and set the angle towards the scene origin
      camera.position.set(0, 400, 400);
      camera.lookAt(scene.position);

      //////////////
      // RENDERER //
      //////////////

      // create and start the renderer; choose antialias setting.
      if (window.Detector.webgl)
        renderer = new window.THREE.WebGLRenderer({ antialias: true });
      else renderer = new window.THREE.CanvasRenderer();

      renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

      // attach div element to variable to contain the renderer
      container = this.refs.anchor;
      // alternatively: to create the div at runtime, use:
      //   container = document.createElement( 'div' );
      //    document.body.appendChild( container );

      // attach renderer to the container div
      container.appendChild(renderer.domElement);

      ////////////
      // EVENTS //
      ////////////
      // automatically resize renderer
      window.THREEx.WindowResize(renderer, camera);
      // toggle full-screen on given key press
      window.THREEx.FullScreen.bindKey({ charCode: "m".charCodeAt(0) });

      //////////////
      // CONTROLS //
      //////////////
      // move mouse and: left   click to rotate,
      //                 middle click to zoom,
      //                 right  click to pan
      controls = new window.THREE.OrbitControls(camera, renderer.domElement);

      ///////////
      // STATS //
      ///////////

      // displays current and past frames per second attained by scene
      stats = new window.Stats();
      stats.domElement.style.position = "absolute";
      stats.domElement.style.bottom = "0px";
      stats.domElement.style.zIndex = 100;
      container.appendChild(stats.domElement);

      ///////////
      // LIGHT //
      ///////////

      // create a light
      var light = new window.THREE.PointLight(0x61C12E);
      light.position.set(0, 250, 0);
      //scene.add(light);
      var ambientLight = new window.THREE.AmbientLight(0x404040);
      scene.add(ambientLight);

      //////////////
      // GEOMETRY //
      //////////////

      // most objects displayed are a "mesh":
      //  a collection of points ("geometry") and
      //  a set of surface parameters ("material")
      // Sphere parameters: radius, segments along width, segments along height
      var sphereGeometry = new window.THREE.SphereGeometry(50, 32, 16);
      // use a "lambert" material rather than "basic" for realistic lighting.
      //   (don't forget to add (at least one) light!)
      var sphereMaterial = new window.THREE.MeshLambertMaterial({
        color: 0x8888ff
      });
      var sphere = new window.THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.set(100, 50, -50);
      scene.add(sphere);

      // Create an array of materials to be used in a cube, one for each side
      var cubeMaterialArray = [];
      // order to add materials: x+,x-,y+,y-,z+,z-
      cubeMaterialArray.push(
        new window.THREE.MeshBasicMaterial({ color: 0xff3333 })
      );
      cubeMaterialArray.push(
        new window.THREE.MeshBasicMaterial({ color: 0xff8800 })
      );
      cubeMaterialArray.push(
        new window.THREE.MeshBasicMaterial({ color: 0xffff33 })
      );
      cubeMaterialArray.push(
        new window.THREE.MeshBasicMaterial({ color: 0x33ff33 })
      );
      cubeMaterialArray.push(
        new window.THREE.MeshBasicMaterial({ color: 0x3333ff })
      );
      cubeMaterialArray.push(
        new window.THREE.MeshBasicMaterial({ color: 0x8833ff })
      );
      var cubeMaterials = new window.THREE.MeshFaceMaterial(cubeMaterialArray);
      // Cube parameters: width (x), height (y), depth (z),
      //        (optional) segments along x, segments along y, segments along z
      var cubeGeometry = new window.THREE.CubeGeometry(100, 100, 100, 1, 1, 1);
      // using THREE.MeshFaceMaterial() in the constructor below
      //   causes the mesh to use the materials stored in the geometry
      cube = new window.THREE.Mesh(cubeGeometry, cubeMaterials);
      cube.position.set(-100, 50, -50);
      scene.add(cube);
      // create a set of coordinate axes to help orient user
      //    specify length in pixels in each direction
      var axes = new window.THREE.AxisHelper(100);
      scene.add(axes);

      ///////////
      // FLOOR //
      ///////////

      // note: 4x4 checkboard pattern scaled so that each square is 25 by 25 pixels.
      var floorTexture = new window.THREE.ImageUtils.loadTexture(checkerboard);
      floorTexture.wrapS = floorTexture.wrapT = window.THREE.RepeatWrapping;
      floorTexture.repeat.set(10, 10);
      // DoubleSide: render texture on both sides of mesh
      var floorMaterial = new window.THREE.MeshBasicMaterial({
        map: floorTexture,
        side: window.THREE.DoubleSide
      });
      var floorGeometry = new window.THREE.PlaneGeometry(1000, 1000, 1, 1);
      var floor = new window.THREE.Mesh(floorGeometry, floorMaterial);
      floor.position.y = -0.5;
      floor.rotation.x = Math.PI / 2;
      scene.add(floor);

      /////////
      // SKY //
      /////////

      // recommend either a skybox or fog effect (can't use both at the same time)
      // without one of these, the scene's background color is determined by webpage background
      // make sure the camera's "far" value is large enough so that it will render the skyBox!
      var skyBoxGeometry = new window.THREE.CubeGeometry(1000, 1000, 1000);
      // BackSide: render faces from inside of the cube, instead of from outside (default).
      var skyBoxMaterial = new window.THREE.MeshBasicMaterial({
        color: 0x324229,
        side: window.THREE.BackSide
      });
      var skyBox = new window.THREE.Mesh(skyBoxGeometry, skyBoxMaterial);
      scene.add(skyBox);

      // fog must be added to scene before first render
      scene.fog = new window.THREE.FogExp2(0x9999ff, 0.00025);
    };
    function animate() {
      requestAnimationFrame(animate);
      render();
      update();
    }
    function update() {
      // delta = change in time since last call (in seconds)
      var delta = clock.getDelta();
      // functionality provided by THREEx.KeyboardState.js
      if (keyboard.pressed("1"))
        document.getElementById("message").innerHTML = " Have a nice day! - 1";
      if (keyboard.pressed("2"))
        document.getElementById("message").innerHTML = " Have a nice day! - 2 ";

      controls.update();
      stats.update();
    }
    function render() {
      renderer.render(scene, camera);
    }

    // initialization
    init();
    // animation loop / game loop
    animate();
  }

  render() {
    // Ref liefert Handle auf Components direkt oder bei HTML Components auf das DOM-Element
    // Ist verfügbar sofort, nachdem Component gemountet wurde
    return (
      <div>
        <div ref="anchor" />
      </div>
    );
  }
}

export default HelloWorld3D;
