var glslify = require('glslify');
var path = require('path');
var textureLoader = new THREE.TextureLoader();
textureMoon = textureLoader.load(path.join(__dirname, '../textures/moon.jpg'));
const moonMaterial = new THREE.MeshPhongMaterial({
  map: textureMoon,
  bumpMap: textureMoon,
  bumpScale: 0.5
});

module.exports = function(scene, star) {
  return generatePlanet(scene,star);
}

function generatePlanet(scene, star) {
  const planeSize = 20;
  const planeSegments = 50;
  const geo = new THREE.SphereGeometry(planeSize, planeSegments, planeSegments);
  // Setup our mesh
  const mesh = new THREE.Mesh(geo, moonMaterial);
  pivot = new THREE.Object3D();
  pivot.rotation.z = 2 * Math.PI/2;
  star.mesh1.add(pivot);
  pivot.add(mesh);
  mesh.position.set(0, 0, -500);
  return pivot;
}