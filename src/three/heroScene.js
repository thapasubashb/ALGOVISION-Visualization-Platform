export function buildHeroScene(THREE, group) {
  const NODE_COUNT = 34
  const nodePositions = []
  const nodeGeometry = new THREE.SphereGeometry(0.09, 12, 12)
  const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0x3b82f6 })

  for (let i = 0; i < NODE_COUNT; i++) {
    const y = 1 - (i / (NODE_COUNT - 1)) * 2
    const radiusAtY = Math.sqrt(1 - y * y)
    const theta = Math.PI * (3 - Math.sqrt(5)) * i
    const x = Math.cos(theta) * radiusAtY
    const z = Math.sin(theta) * radiusAtY
    const pos = new THREE.Vector3(x, y, z).multiplyScalar(6)
    nodePositions.push(pos)
    const sphere = new THREE.Mesh(nodeGeometry, nodeMaterial)
    sphere.position.copy(pos)
    group.add(sphere)
  }

  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x93c5fd, transparent: true, opacity: 0.6 })
  const drawnPairs = new Set()
  nodePositions.forEach((pos, i) => {
    const closest = nodePositions
      .map((p, j) => ({ j, dist: pos.distanceTo(p) }))
      .filter((d) => d.j !== i)
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 2)
    closest.forEach(({ j }) => {
      const key = [i, j].sort().join('-')
      if (drawnPairs.has(key)) return
      drawnPairs.add(key)
      const geometry = new THREE.BufferGeometry().setFromPoints([pos, nodePositions[j]])
      group.add(new THREE.Line(geometry, lineMaterial))
    })
  })

  return [nodeGeometry, nodeMaterial, lineMaterial]
}