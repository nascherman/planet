var glslify = require('glslify');
var path = require('path');
var textureLoader = new THREE.TextureLoader();
var textureFlare0 = textureLoader.load( "../textures/lensflare0.png" );
var textureFlare2 = textureLoader.load( "../textures/lensflare2.png" );
var textureFlare3 = textureLoader.load( "../textures/lensflare3.png" );
var textureSun = textureLoader.load('../textures/sun.jpg');
var textureWhite = textureLoader.load('../textures/white.jpg');

module.exports = function (scene) {
  const stellarMaterial = new THREE.ShaderMaterial({
    vertexShader: glslify(path.join(__dirname, '../shaders/sun.vert')),
    fragmentShader: glslify(path.join(__dirname, '../shaders/sun.frag')),
    uniforms: {
      texture: {type: 't', value: textureSun },
      time: { type: 'f', value: 0 },
      tGlow: { type: "t", value: textureSun }
    },
    transparent: true,
    depthWrite: false,
    alphaTest: 1.00
  });
  const heatMaterial = new THREE.ShaderMaterial({
    vertexShader: glslify(path.join(__dirname, '../shaders/glow.vert')),
    fragmentShader: glslify(path.join(__dirname, '../shaders/glow.frag')),
    uniforms: {
      opacity: { type: 'f', value: 0.1 },
      time: { type: 'f', value: 0 },
      texture: {type: 't', value: textureWhite }
    },
    transparent: true,
    depthWrite: false,
    alphaTest: 1.0
  });
  
  addLight(0.77,0.77,0.77, 0, 0, 0 );
  
  const planeSize = 300;
  const planeSegments = 300;
  let starGeometry = new THREE.SphereGeometry(planeSize, planeSegments, planeSegments);
  let heatGeometry = new THREE.SphereGeometry(planeSize * 1.001, planeSegments, planeSegments);
  // Setup our mesh
  const mesh1 = new THREE.Mesh(starGeometry, stellarMaterial);
  const mesh2 = new THREE.Mesh(heatGeometry, heatMaterial);
  scene.add(mesh1);
  scene.add(mesh2);
  mesh2.position.y -= 10;
  return {
    mesh1: mesh1,
    mesh2: mesh2,
    geo1: starGeometry,
    geo2: heatGeometry,
    mat1: stellarMaterial,
    mat2: heatMaterial
  };

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
}
