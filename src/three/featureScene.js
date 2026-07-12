export function buildFeatureScene(THREE, group) {
  const geometry = new THREE.IcosahedronGeometry(4.2, 1)
  const material = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true, transparent: true, opacity: 0.3 })
  group.add(new THREE.Mesh(geometry, material))
  return [geometry, material]
}