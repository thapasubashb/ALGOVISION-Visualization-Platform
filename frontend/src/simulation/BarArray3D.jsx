import { AnimatePresence } from 'framer-motion'
import Scene3D from './Scene3D'
import Box3D from './Box3D'

const STATE_COLOR = {
  default: 'blue',
  compare: 'amber',
  swap: 'rose',
  pivot: 'purple',
  sorted: 'teal',
  active: 'indigo',
}

const BAR_WIDTH = 46
const BAR_DEPTH = 34
const GAP = 16
const MAX_BAR_HEIGHT = 150
const MIN_BAR_HEIGHT = 28
const BASELINE_Y = 80

/**
 * Real extruded 3D bars for every sorting/searching visualizer. Bar
 * height is normalized against the current max value (not a fixed
 * pixels-per-unit scale), so the tallest bar always fits within
 * MAX_BAR_HEIGHT regardless of the actual data range -- this is what
 * keeps bars from ever poking out of the scene's bounds.
 */
function BarArray3D({ values, states = [] }) {
  const n = values.length
  const totalWidth = n * (BAR_WIDTH + GAP) - GAP
  const maxValue = Math.max(...values, 1)

  return (
    <Scene3D height={300} initialRotateX={-24} initialRotateY={-30}>
      <div style={{ position: 'relative', width: totalWidth, height: 220 }}>
        <AnimatePresence>
          {values.map((value, i) => {
            const height = MIN_BAR_HEIGHT + (value / maxValue) * (MAX_BAR_HEIGHT - MIN_BAR_HEIGHT)
            const x = i * (BAR_WIDTH + GAP) - totalWidth / 2 + BAR_WIDTH / 2
            const color = STATE_COLOR[states[i] || 'default']
            return (
              <Box3D
                key={`${i}-${value}`}
                animateKey={`${i}-${value}`}
                x={x}
                y={BASELINE_Y - height / 2}
                z={0}
                width={BAR_WIDTH}
                height={height}
                depth={BAR_DEPTH}
                color={color}
                label={value}
              />
            )
          })}
        </AnimatePresence>
      </div>
    </Scene3D>
  )
}

export default BarArray3D
