global.THREE = require('three');
const createApp = require('./app');
const createLoop = require('raf-loop');
const glslify = require('glslify');
const path = require('path');
var canvg = require('canvg-client');
var load = require('load-svg');
var svgToImage = require('svg-to-image');
var getContext = require('get-canvas-context');
var context = getContext('2d', {
  width: 10000,
  height: 6000
});
var canvas = context.canvas;
let ambientLight = new THREE.AmbientLight(0xffffff);
let light = new THREE.PointLight( 0xffffff );
let spotLight = new THREE.SpotLight( 0xffffff );
// Create our basic ThreeJS application
const {
  renderer,
  camera,
  scene,
  updateControls
} = createApp();

camera.add(light);
camera.add(spotLight)
const planeSize = 210;
const planeSegments = 65;
let geometry = new THREE.SphereGeometry(planeSize, planeSegments, planeSegments);
let geometry2 = new THREE.SphereGeometry(planeSize * 1.028, planeSegments, planeSegments);

    const material = new THREE.ShaderMaterial({
      vertexShader: glslify(path.join(__dirname, 'shader.vert')),
      fragmentShader: glslify(path.join(__dirname, 'shader.frag')),
      uniforms: {
        texture: {type: 't', value: THREE.ImageUtils.loadTexture('./sun.jpg') },
        time: { type: 'f', value: 0 },
        tGlow: { type: "t", value: THREE.ImageUtils.loadTexture('./sun.jpg') }
      }
    });
    const material2 = new THREE.ShaderMaterial({
      vertexShader: glslify(path.join(__dirname, 'glow.vert')),
      fragmentShader: glslify(path.join(__dirname, 'glow.frag')),
      uniforms: {
        opacity: { type: 'f', value: 0.3 },
        time: { type: 'f', value: 0 },
        texture: {type: 't', value: THREE.ImageUtils.loadTexture('./white.jpg') }
      },
      wireframe: false,
      transparent: true
    });
    // Setup our mesh
    const mesh = new THREE.Mesh(geometry, material);
    const mesh2 = new THREE.Mesh(geometry2, material2);
    scene.add(mesh);
    scene.add(mesh2);
    window.scene = scene;
    // update time in seconds
    createLoop((dt) => {
      material.uniforms.time.value += dt / 1000;
      material2.uniforms.time.value += dt / 200;
      updateControls();
      renderer.render(scene, camera);
    }).start();
  //});

