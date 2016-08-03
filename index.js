global.THREE = require('three');
const createApp = require('./app');
const createLoop = require('raf-loop');
const glslify = require('glslify');
const path = require('path');
var textureLoader = new THREE.TextureLoader();
var textureFlare0 = textureLoader.load( "textures/lensflare0.png" );
var textureFlare2 = textureLoader.load( "textures/lensflare2.png" );
var textureFlare3 = textureLoader.load( "textures/lensflare3.png" );
var textureSun = textureLoader.load('./textures/sun.jpg');
var textureWhite = textureLoader.load('./textures/white.jpg');

const stellarMaterial = new THREE.ShaderMaterial({
  vertexShader: glslify(path.join(__dirname, 'shader.vert')),
  fragmentShader: glslify(path.join(__dirname, 'shader.frag')),
  uniforms: {
    texture: {type: 't', value: textureSun },
    time: { type: 'f', value: 0 },
    tGlow: { type: "t", value: textureSun }
  },
  depthWrite: false
});
const heatMaterial = new THREE.ShaderMaterial({
  vertexShader: glslify(path.join(__dirname, 'glow.vert')),
  fragmentShader: glslify(path.join(__dirname, 'glow.frag')),
  uniforms: {
    opacity: { type: 'f', value: 0.3 },
    time: { type: 'f', value: 0 },
    texture: {type: 't', value: textureWhite }
  },
  wireframe: false,
  transparent: true,
  depthWrite: false
});


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
scene.fog = new THREE.Fog( 0x000000, 3500, 15000 );
scene.fog.color.setHSL( 0.51, 0.4, 0.01 );
renderer.setClearColor( scene.fog.color );

addLight( 0.55, 0.9, 0.5, 0, 0, 0 );

const planeSize = 210;
const planeSegments = 65;
let starGeometry = new THREE.SphereGeometry(planeSize, planeSegments, planeSegments);
let heatGeometry = new THREE.SphereGeometry(planeSize * 1.028, planeSegments, planeSegments);
var skyGeo = new THREE.SphereGeometry( 1000, 32, 32 );
// Setup our mesh
const mesh = new THREE.Mesh(starGeometry, stellarMaterial);
const mesh2 = new THREE.Mesh(heatGeometry, heatMaterial);

scene.add(mesh);
scene.add(mesh2);
window.scene = scene;
// update time in seconds
createLoop((dt) => {
  stellarMaterial.uniforms.time.value += dt / 1000;
  heatMaterial.uniforms.time.value += dt / 200;
  updateControls();
  renderer.render(scene, camera);
}).start();

function addLight( h, s, l, x, y, z ) {
  var light = new THREE.PointLight( 0xffffff, 1.5, 2000 );
  light.color.setHSL( h, s, l );
  light.position.set( x, y, z );
  scene.add( light );
  var flareColor = new THREE.Color( 0xffffff );
  flareColor.setHSL( h, s, l + 0.5 );
  var lensFlare = new THREE.LensFlare( textureFlare0, 1500, 0.0, THREE.AdditiveBlending, flareColor );
  lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );
  lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );
  lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );
  lensFlare.add( textureFlare3, 60, 0.6, THREE.AdditiveBlending );
  lensFlare.add( textureFlare3, 70, 0.7, THREE.AdditiveBlending );
  lensFlare.add( textureFlare3, 120, 0.9, THREE.AdditiveBlending );
  lensFlare.add( textureFlare3, 70, 1.0, THREE.AdditiveBlending );
  lensFlare.customUpdateCallback = lensFlareUpdateCallback;
  lensFlare.position.copy( light.position );
  scene.add( lensFlare );
}

function lensFlareUpdateCallback( object ) {
  var f, fl = object.lensFlares.length;
  var flare;
  var vecX = -object.positionScreen.x * 2;
  var vecY = -object.positionScreen.y * 2;
  for( f = 0; f < fl; f++ ) {
    flare = object.lensFlares[ f ];
    flare.x = object.positionScreen.x + vecX * flare.distance;
    flare.y = object.positionScreen.y + vecY * flare.distance;
    flare.rotation = 0;
  }
  object.lensFlares[ 2 ].y += 0.025;
  object.lensFlares[ 3 ].rotation = object.positionScreen.x * 0.5 + THREE.Math.degToRad( 45 );
}
