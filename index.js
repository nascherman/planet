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
const planeSize = 100;
const planeSegments = 30;
let geometry = new THREE.SphereGeometry(planeSize, planeSegments, planeSegments);
// geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
// Create our vertex/fragment shaders

  //svgToImage(svg.outerHTML, (err, image) => {
    //var texture = new THREE.Texture(image);
    //texture.minFilter = THREE.NearestFilter;
    //texture.magFilter = THREE.LinearFilter;
    //texture.generateMipmaps = true;
    //texture.anisotropy = renderer.getMaxAnisotropy();
    //texture.needsUpdate = true;
    const material = new THREE.ShaderMaterial({
      vertexShader: glslify(path.join(__dirname, 'shader.vert')),
      fragmentShader: glslify(path.join(__dirname, 'shader.frag')),
      uniforms: {
        texture: {type: 't', value: THREE.ImageUtils.loadTexture('./sun.jpg') },
        time: { type: 'f', value: 0 }
      },
      wireframe: false
    });
    // Setup our mesh
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    window.scene = scene;
    // update time in seconds
    createLoop((dt) => {
      material.uniforms.time.value += dt / 1000;
      updateControls();
      renderer.render(scene, camera);
    }).start();
  //});

