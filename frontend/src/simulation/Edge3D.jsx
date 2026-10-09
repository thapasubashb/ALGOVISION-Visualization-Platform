import { motion } from 'framer-motion'

/**
 * A straight connector line between two points in the same Scene3D
 * (preserve-3d) context, used for tree edges (BST) and graph edges.
 * Computes its own length/angle from the two endpoints so it rotates
 * correctly with the rest of the 3D scene. Position is top-left based
 * (not center-based) so it can be combined cleanly with framer-motion's
 * own animate-driven transform, rather than fighting it with a manual
 * CSS transform string.
 */
function Edge3D({ from, to, color = '#94a3b8', thickness = 4, animateKey }) {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const length = Math.sqrt(dx * dx + dy * dy)
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI
  const midX = (from.x + to.x) / 2
  const midY = (from.y + to.y) / 2
  const midZ = ((from.z || 0) + (to.z || 0)) / 2
  const leftX = midX - length / 2
  const topY = midY - thickness / 2

  return (
    <motion.div
      layout
      key={animateKey}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, x: leftX, y: topY, z: midZ, rotateZ: angle }}
      exit={{ opacity: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 26 }}
      style={{
        position: 'absolute',
        width: length,
        height: thickness,
        background: color,
        borderRadius: thickness,
        transformOrigin: 'center',
      }}
    />
  )
}

export default Edge3D
