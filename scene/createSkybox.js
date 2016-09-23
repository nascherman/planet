var path = require('path');
var textureLoader = new THREE.TextureLoader();
textureSkybox = textureLoader.load(ASSET_FOLDER + 'textures/space-sphere.jpg');
const skyboxMaterial = new THREE.MeshBasicMaterial( {
  map: textureSkybox,
  side: THREE.BackSide
})
module.exports = function(scene) {
  var geo = new THREE.SphereGeometry(10000, 40, 40);
  var sphere = new THREE.Mesh(geo, skyboxMaterial);
  scene.add(sphere);
}