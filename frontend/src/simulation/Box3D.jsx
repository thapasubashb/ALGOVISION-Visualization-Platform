import { motion } from 'framer-motion'

const COLOR_HEX = {
  blue: '#3b82f6', indigo: '#6366f1', purple: '#a855f7', pink: '#ec4899',
  rose: '#f43f5e', amber: '#f59e0b', teal: '#14b8a6', slate: '#64748b',
  emerald: '#10b981', cyan: '#06b6d4',
}

/**
 * A real extruded 3D box: six actual faces positioned with translateZ +
 * rotate inside a Scene3D preserve-3d context. Each face uses a directional
 * gradient (not a flat fill) to read as a lit, solid material rather than
 * a thin flat plane, plus a soft contact shadow beneath it for grounding.
 */
function Box3D({ x = 0, y = 0, z = 0, width = 64, height = 64, depth = 32, color = 'blue', label, sublabel, animateKey }) {
  const hex = COLOR_HEX[color] || COLOR_HEX.blue
  const half = depth / 2
  const radius = Math.min(10, width / 5, height / 5)

  const faceBase = {
    position: 'absolute',
    width,
    height,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    color: 'white',
    fontSize: 13,
    backfaceVisibility: 'hidden',
  }

  return (
    <motion.div
      layout
      key={animateKey}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1, x, y, z }}
      exit={{ opacity: 0, scale: 0.6 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      style={{ position: 'absolute', transformStyle: 'preserve-3d', width, height, filter: `drop-shadow(0 ${8 + half / 2}px ${10 + half}px rgba(0,0,0,0.35))` }}
    >
      {/* contact shadow on the ground, faked with a squashed dark ellipse below the box */}
      <div
        style={{
          position: 'absolute',
          width: width * 0.9,
          height: depth * 0.7,
          left: width * 0.05,
          background: 'radial-gradient(ellipse, rgba(0,0,0,0.35), transparent 70%)',
          transform: `rotateX(90deg) translateZ(-${height - half}px) translateY(${half + 4}px)`,
        }}
      />
      {/* bottom */}
      <div style={{ ...faceBase, height: depth, background: hex, filter: 'brightness(0.35)', transform: `rotateX(-90deg) translateZ(${height - half}px)`, top: height - depth, borderRadius: radius }} />
      {/* back */}
      <div style={{ ...faceBase, background: `linear-gradient(200deg, ${hex}, color-mix(in srgb, ${hex} 55%, black))`, transform: `translateZ(-${half}px) rotateY(180deg)`, borderRadius: radius }} />
      {/* left */}
      <div style={{ ...faceBase, width: depth, background: `linear-gradient(90deg, color-mix(in srgb, ${hex} 45%, black), ${hex})`, transform: `rotateY(-90deg) translateZ(${half}px)`, borderRadius: radius }} />
      {/* right */}
      <div style={{ ...faceBase, width: depth, background: `linear-gradient(90deg, ${hex}, color-mix(in srgb, ${hex} 50%, black))`, transform: `rotateY(90deg) translateZ(${width - half}px)`, left: width - depth, borderRadius: radius }} />
      {/* top */}
      <div style={{ ...faceBase, height: depth, background: `linear-gradient(160deg, color-mix(in srgb, ${hex} 70%, white), ${hex})`, transform: `rotateX(90deg) translateZ(${half}px)`, borderRadius: radius }} />
      {/* front */}
      <div style={{ ...faceBase, background: `linear-gradient(150deg, color-mix(in srgb, ${hex} 55%, white), ${hex} 55%, color-mix(in srgb, ${hex} 70%, black))`, transform: `translateZ(${half}px)`, borderRadius: radius, flexDirection: 'column', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -6px 12px rgba(0,0,0,0.15)' }}>
        <span style={{ textShadow: '0 1px 2px rgba(0,0,0,0.35)' }}>{label}</span>
        {sublabel && <span style={{ fontSize: 10, fontWeight: 600, opacity: 0.9, textShadow: '0 1px 2px rgba(0,0,0,0.35)' }}>{sublabel}</span>}
      </div>
    </motion.div>
  )
}

export default Box3D
