import { AnimatePresence, motion } from 'framer-motion'

/**
 * Displays the current step's title + explanation, and crossfades whenever
 * the step changes so the text never just "pops" — it stays in sync with
 * the animation happening in the canvas above it.
 */
function StepExplanation({ step, stepIndex }) {
  if (!step) return null

  return (
    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 min-h-[92px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={stepIndex}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <h4 className="text-sm font-bold text-slate-800 mb-1">{step.title}</h4>
          <p className="text-sm text-slate-600 leading-relaxed">{step.explanation}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default StepExplanation
