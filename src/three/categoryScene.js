export function buildCategoryScene(THREE, group) {
  const geometry = new THREE.TorusKnotGeometry(3.2, 0.75, 100, 16)
  const material = new THREE.MeshBasicMaterial({ color: 0x0ea5e9, wireframe: true, transparent: true, opacity: 0.25 })
  group.add(new THREE.Mesh(geometry, material))
  return [geometry, material]
}