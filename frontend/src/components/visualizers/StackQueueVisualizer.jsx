import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { pushTrace, popTrace, enqueueTrace, dequeueTrace } from '../../algorithms/stackQueue'

const SPEED_OPTIONS = [0.5, 1, 1.5, 2]

function StackQueueVisualizer() {
  const [mode, setMode] = useState('stack')
  const [items, setItems] = useState([
    { id: 'a', value: 10 },
    { id: 'b', value: 20 },
  ])
  const [valueText, setValueText] = useState('')
  const [error, setError] = useState('')

  const [steps, setSteps] = useState([{ items, highlight: [], description: 'Ready — pick an operation' }])
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)

  function switchMode(newMode) {
    setMode(newMode)
    setSteps([{ items, highlight: [], description: 'Ready — pick an operation' }])
    setCurrentStep(0)
    setIsPlaying(false)
  }

  function runOperation(opId) {
    let trace
    if (opId === 'push' || opId === 'enqueue') {
      const value = Number(valueText)
      if (valueText.trim() === '' || isNaN(value)) { setError('Please enter a number'); return }
      setError('')
      trace = opId === 'push' ? pushTrace(items, value) : enqueueTrace(items, value)
    } else if (opId === 'pop') {
      trace = popTrace(items)
    } else {
      trace = dequeueTrace(items)
    }
    setSteps(trace)
    setCurrentStep(0)
    setIsPlaying(false)
    setItems(trace[trace.length - 1].items)
  }

  useEffect(() => {
    if (!isPlaying) return
    if (currentStep >= steps.length - 1) { setIsPlaying(false); return }
    const delay = 700 / speed
    const timer = setTimeout(() => setCurrentStep((s) => s + 1), delay)
    return () => clearTimeout(timer)
  }, [isPlaying, currentStep, steps, speed])

  const step = steps[currentStep]

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-8">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Stack & Queue</h3>

      <div className="flex gap-2 mb-4 justify-center">
        <button onClick={() => switchMode('stack')} className={`px-4 py-2 rounded-lg text-sm font-semibold ${mode === 'stack' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
          Stack (LIFO)
        </button>
        <button onClick={() => switchMode('queue')} className={`px-4 py-2 rounded-lg text-sm font-semibold ${mode === 'queue' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
          Queue (FIFO)
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-2 justify-center">
        <input
          type="text"
          value={valueText}
          onChange={(e) => setValueText(e.target.value)}
          placeholder="Value"
          className="w-28 border border-slate-300 rounded-lg px-3 py-2 text-sm"
        />
        {mode === 'stack' ? (
          <>
            <button onClick={() => runOperation('push')} className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm">Push</button>
            <button onClick={() => runOperation('pop')} className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm">Pop</button>
          </>
        ) : (
          <>
            <button onClick={() => runOperation('enqueue')} className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm">Enqueue</button>
            <button onClick={() => runOperation('dequeue')} className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm">Dequeue</button>
          </>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mb-4 text-center">{error}</p>}

      <div className="flex justify-center py-6 min-h-[220px] items-end">
        {mode === 'stack' ? (
          <div className="flex flex-col-reverse items-center gap-2">
            <AnimatePresence initial={false}>
              {step.items.map((node) => (
                <motion.div
                  key={node.id}
                  layout
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className={`w-24 h-14 rounded-lg border-2 flex items-center justify-center font-bold text-lg ${
                    step.highlight.includes(node.id) ? 'bg-teal-100 border-teal-400 text-teal-700' : 'bg-white border-slate-300 text-slate-700'
                  }`}
                >
                  {node.value}
                </motion.div>
              ))}
            </AnimatePresence>
            {step.items.length > 0 && <span className="text-xs text-slate-400 mt-1">↑ top</span>}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 mr-1">front →</span>
            <AnimatePresence initial={false}>
              {step.items.map((node) => (
                <motion.div
                  key={node.id}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className={`w-16 h-16 rounded-lg border-2 flex items-center justify-center font-bold text-lg ${
                    step.highlight.includes(node.id) ? 'bg-teal-100 border-teal-400 text-teal-700' : 'bg-white border-slate-300 text-slate-700'
                  }`}
                >
                  {node.value}
                </motion.div>
              ))}
            </AnimatePresence>
            <span className="text-xs text-slate-400 ml-1">← rear</span>
          </div>
        )}
      </div>

      <p className="text-sm text-slate-600 mb-4 text-center">{step.description}</p>

      <div className="flex items-center gap-3 flex-wrap">
        <button onClick={() => setCurrentStep((s) => Math.max(0, s - 1))} disabled={currentStep === 0} className="px-3 py-2 bg-slate-200 rounded-lg disabled:opacity-40">Back</button>
        <button onClick={() => setIsPlaying((p) => !p)} className="px-4 py-2 bg-blue-600 text-white rounded-lg">{isPlaying ? 'Pause' : 'Play'}</button>
        <button onClick={() => setCurrentStep((s) => Math.min(steps.length - 1, s + 1))} disabled={currentStep === steps.length - 1} className="px-3 py-2 bg-slate-200 rounded-lg disabled:opacity-40">Next</button>

        <div className="flex items-center gap-1 ml-2">
          <span className="text-xs text-slate-400 mr-1">Speed:</span>
          {SPEED_OPTIONS.map((option) => (
            <button key={option} onClick={() => setSpeed(option)} className={`px-2 py-1 text-xs rounded-md ${speed === option ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
              {option}x
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-400 ml-auto">Step {currentStep + 1} / {steps.length}</span>
      </div>
    </div>
  )
}

export default StackQueueVisualizer