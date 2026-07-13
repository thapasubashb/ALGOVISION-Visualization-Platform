import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  insertAtHeadTrace,
  insertAtTailTrace,
  deleteByValueTrace,
  traverseTrace,
  reverseTrace,
} from '../../algorithms/linkedList'

const SPEED_OPTIONS = [0.5, 1, 1.5, 2]

const OPERATIONS = [
  { id: 'insert-head', label: 'Insert at Head', needsValue: true },
  { id: 'insert-tail', label: 'Insert at Tail', needsValue: true },
  { id: 'delete', label: 'Delete by Value', needsValue: true },
  { id: 'traverse', label: 'Traverse', needsValue: false },
  { id: 'reverse', label: 'Reverse', needsValue: false },
]

function LinkedListVisualizer() {
  const [list, setList] = useState([
    { id: 'n1', value: 10 },
    { id: 'n2', value: 20 },
    { id: 'n3', value: 30 },
  ])
  const [operation, setOperation] = useState('insert-head')
  const [valueText, setValueText] = useState('')
  const [error, setError] = useState('')

  const [steps, setSteps] = useState([{ list, pointer: null, highlight: [], description: 'Ready — pick an operation and run it' }])
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)

  const selectedOp = OPERATIONS.find((op) => op.id === operation)

  function handleRun() {
    let value
    if (selectedOp.needsValue) {
      value = Number(valueText)
      if (valueText.trim() === '' || isNaN(value)) { setError('Please enter a number'); return }
    }
    setError('')

    let trace
    if (operation === 'insert-head') trace = insertAtHeadTrace(list, value)
    else if (operation === 'insert-tail') trace = insertAtTailTrace(list, value)
    else if (operation === 'delete') trace = deleteByValueTrace(list, value)
    else if (operation === 'traverse') trace = traverseTrace(list)
    else if (operation === 'reverse') trace = reverseTrace(list)

    setSteps(trace)
    setCurrentStep(0)
    setIsPlaying(false)
    setList(trace[trace.length - 1].list)
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
      <h3 className="text-lg font-bold text-slate-800 mb-4">Linked List Operations</h3>

      <div className="flex flex-wrap gap-2 mb-2 justify-center">
        <select
          value={operation}
          onChange={(e) => setOperation(e.target.value)}
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
        >
          {OPERATIONS.map((op) => (
            <option key={op.id} value={op.id}>{op.label}</option>
          ))}
        </select>

        {selectedOp.needsValue && (
          <input
            type="text"
            value={valueText}
            onChange={(e) => setValueText(e.target.value)}
            placeholder="Value"
            className="w-28 border border-slate-300 rounded-lg px-3 py-2 text-sm"
          />
        )}

        <button onClick={handleRun} className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm">
          Run
        </button>
      </div>
      {error && <p className="text-red-500 text-xs mb-4 text-center">{error}</p>}

      <div className="flex justify-center overflow-x-auto py-6">
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <AnimatePresence initial={false}>
            {step.list.map((node) => {
              let boxStyle = 'bg-white border-slate-300 text-slate-700'
              if (step.highlight.includes(node.id)) boxStyle = 'bg-teal-100 border-teal-400 text-teal-700'
              else if (node.id === step.pointer) boxStyle = 'bg-amber-100 border-amber-400 text-amber-700'

              return (
                <motion.div
                  key={node.id}
                  layout
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="flex items-center gap-3"
                >
                  <div className={`w-16 h-16 rounded-lg border-2 flex items-center justify-center font-bold text-lg ${boxStyle}`}>
                    {node.value}
                  </div>
                  <span className="text-slate-300 text-xl">→</span>
                </motion.div>
              )
            })}
          </AnimatePresence>
          <div className="px-3 py-1 rounded-md border-2 border-dashed border-slate-300 text-slate-400 text-xs font-semibold">
            null
          </div>
        </div>
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

export default LinkedListVisualizer