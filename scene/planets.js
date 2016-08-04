module.exports = function(scene, star) {
  return generatePlanet(scene,star);
}

function generatePlanet(scene, star) {
  const planeSize = 20;
  const planeSegments = 50;
  const geo = new THREE.SphereGeometry(planeSize, planeSegments, planeSegments);
  var mat = new THREE.MeshBasicMaterial({
    wireframe: true
  })
  // Setup our mesh
  const mesh = new THREE.Mesh(geo, mat);
  pivot = new THREE.Object3D();
  pivot.rotation.z = 2 * Math.PI/2;
  star.mesh1.add(pivot);
  pivot.add(mesh);
  mesh.position.set(0, 0, -500);
  return pivot;
}