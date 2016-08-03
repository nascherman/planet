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
renderer.setClearColor(0xffffff);
camera.add(light);
camera.add(spotLight)
const planeSize = 100;
const planeSegments = 30;
let geometry = new THREE.SphereGeometry(planeSize, planeSegments, planeSegments);
// geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
// Create our vertex/fragment shaders
// const material = new THREE.RawShaderMaterial({
//   vertexShader: glslify(path.join(__dirname, 'shader.vert')),
//   fragmentShader: glslify(path.join(__dirname, 'shader.frag')),
//   transparent: true,
//   side: THREE.DoubleSide,
//   wireframe: true,
//   uniforms: {
//     opacity: { type: 'f', value: 1.0 },
//     time: { type: 'f', value: 0 },
//     planeSize: { type: 'f', value: planeSize }
//   }
// });
load('world-map.svg', function(err, svg) {
  svgToImage(svg.outerHTML, (err, image) => {
    var texture = new THREE.Texture(image);
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;
    texture.anisotropy = renderer.getMaxAnisotropy();
    texture.needsUpdate = true;
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: false,
      side: THREE.DoubleSide,
      wireframe: false
    });
    // Setup our mesh
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    window.scene = scene;
    // update time in seconds
    createLoop((dt) => {
      updateControls();
      renderer.render(scene, camera);
    }).start();
  });
});
