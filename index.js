ASSET_FOLDER = process.env.NODE_ENV === 'production' ? '/assets/' : '/';

console.log(ASSET_FOLDER);

global.THREE = require('three');
const createApp = require('./app');
const createLoop = require('raf-loop');
var sun = require ('./scene/star');
var planets = require('./scene/planets');
var createSkybox = require('./scene/createSkybox');
var light = new THREE.PointLight( 0xffffff, 1.5, 2000 )
// Create our basic ThreeJS application
const {
  renderer,
  camera,
  scene,
  updateControls
} = createApp();
scene.add(light);
window.scene = scene;
scene.fog = new THREE.Fog( 0x000000, 3500, 15000 );
scene.fog.color.setHSL( 0.51, 0.4, 0.01 );
renderer.setClearColor( scene.fog.color );
var skybox = createSkybox(scene);
var sunObj = sun(scene);
var planets = planets(scene, sunObj);
// update time in seconds
createLoop((dt) => {
  sunObj.mat1.uniforms.time.value += dt / 1000;
  sunObj.mat2.uniforms.time.value += dt / 200;
  light.position.set(camera.position.x, camera.position.y, camera.position.z);
   planets.rotation.y += 0.0001;
  updateControls();
  // manage camera controls
  if(camera.position.z > 1000) {
    camera.position.z = 1000;
  }
  if(camera.position.x > 1000) {
    camera.position.x = 1000;
  }
  if(camera.position.y > 1000) {
    camera.position.y = 1000;
  }
  renderer.render(scene, camera);
}).start();