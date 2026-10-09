import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ZoomIn, ZoomOut, RotateCw } from 'lucide-react'

/**
 * A genuine CSS 3D scene: a perspective container with a drag-to-rotate,
 * scroll-to-zoom inner stage (transform-style: preserve-3d). Children are
 * positioned with real translateX/Y/Z, so this is actual 3D transform
 * math, not a flat image made to look 3D.
 *
 * - Drag to rotate (mouse or touch)
 * - Scroll wheel, pinch, or the +/- buttons to zoom
 * - The reset button restores the default angle and zoom
 * - overflow is visible (not clipped), so tall content is never cut off --
 *   zoom out or drag to see everything instead of it being hard-clipped.
 */
function Scene3D({ children, height = 320, initialRotateX = -22, initialRotateY = -32 }) {
  const [rotation, setRotation] = useState({ x: initialRotateX, y: initialRotateY })
  const [scale, setScale] = useState(1)
  const dragState = useRef(null)
  const pinchState = useRef(null)

  const clampScale = (s) => Math.max(0.35, Math.min(2.5, s))

  const onPointerDown = (e) => {
    dragState.current = { startX: e.clientX, startY: e.clientY, rotX: rotation.x, rotY: rotation.y }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e) => {
    if (!dragState.current) return
    const dx = e.clientX - dragState.current.startX
    const dy = e.clientY - dragState.current.startY
    setRotation({
      x: Math.max(-70, Math.min(70, dragState.current.rotX - dy * 0.4)),
      y: dragState.current.rotY + dx * 0.4,
    })
  }
  const onPointerUp = () => {
    dragState.current = null
  }
  const onWheel = (e) => {
    e.preventDefault()
    setScale((s) => clampScale(s - e.deltaY * 0.0015))
  }
  const onTouchStart = (e) => {
    if (e.touches.length === 2) {
      const [a, b] = e.touches
      pinchState.current = { dist: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY), scale }
    }
  }
  const onTouchMove = (e) => {
    if (e.touches.length === 2 && pinchState.current) {
      const [a, b] = e.touches
      const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)
      setScale(clampScale(pinchState.current.scale * (dist / pinchState.current.dist)))
    }
  }
  const onTouchEnd = () => {
    pinchState.current = null
  }

  const reset = () => {
    setRotation({ x: initialRotateX, y: initialRotateY })
    setScale(1)
  }

  return (
    <div
      className="relative w-full select-none cursor-grab active:cursor-grabbing touch-none"
      style={{ height, perspective: 900 }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onWheel={onWheel}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ rotateX: rotation.x, rotateY: rotation.y, scale }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div style={{ transformStyle: 'preserve-3d', position: 'relative' }}>
          {children}
        </div>
      </motion.div>

      <div className="absolute bottom-2 right-2 flex items-center gap-1">
        <button
          type="button"
          onClick={() => setScale((s) => clampScale(s - 0.2))}
          className="w-7 h-7 flex items-center justify-center rounded-md bg-white/70 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 shadow-sm"
          aria-label="Zoom out"
        >
          <ZoomOut size={13} />
        </button>
        <button
          type="button"
          onClick={() => setScale((s) => clampScale(s + 0.2))}
          className="w-7 h-7 flex items-center justify-center rounded-md bg-white/70 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 shadow-sm"
          aria-label="Zoom in"
        >
          <ZoomIn size={13} />
        </button>
        <button
          type="button"
          onClick={reset}
          className="w-7 h-7 flex items-center justify-center rounded-md bg-white/70 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 shadow-sm"
          aria-label="Reset view"
        >
          <RotateCw size={12} />
        </button>
      </div>
      <span className="absolute bottom-2 left-2 text-[9px] text-slate-400 dark:text-slate-500 pointer-events-none">
        drag to rotate · scroll to zoom
      </span>
    </div>
  )
}

export default Scene3D
