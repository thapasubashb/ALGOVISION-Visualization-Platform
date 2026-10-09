import { motion } from 'framer-motion'

const STATE_STYLE = {
  default: 'bg-blue-400 dark:bg-blue-500/70',
  compare: 'bg-amber-400 dark:bg-amber-400 av-glow',
  swap: 'bg-rose-400 dark:bg-rose-400 av-glow-danger',
  pivot: 'bg-purple-500 dark:bg-purple-400 av-glow',
  sorted: 'bg-teal-400 dark:bg-teal-400',
  active: 'bg-indigo-400 dark:bg-indigo-400 av-glow',
}

/**
 * Renders an array of values as animated vertical bars, used by every
 * sorting-algorithm visualizer. `states` is an array parallel to `values`
 * with one of the STATE_STYLE keys per index (defaults to 'default').
 * Bars reorder with a spring animation (layout) whenever `values` changes
 * order, which is what makes a swap actually look like a swap.
 */
function BarArray({ values, states = [], maxValue, showLabels = true }) {
  const max = maxValue ?? Math.max(...values, 1)

  return (
    <div className="flex items-end gap-1.5 sm:gap-2 h-48 sm:h-56 px-2">
      {values.map((value, i) => (
        <motion.div
          key={`${i}-${value}`}
          layout
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="flex flex-col items-center justify-end flex-1 min-w-[20px]"
        >
          <motion.div
            layout
            animate={{ height: `${(value / max) * 100}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className={`w-full rounded-t-md ${STATE_STYLE[states[i] || 'default']}`}
          />
          {showLabels && <span className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">{value}</span>}
        </motion.div>
      ))}
    </div>
  )
}

export default BarArray
