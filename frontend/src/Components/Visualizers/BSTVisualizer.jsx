import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { insertTrace, searchTrace, traversalTrace, computeLayout } from '../../algorithms/bst'

const SPEED_OPTIONS = [0.5, 1, 1.5, 2]

const OPERATIONS = [
  { id: 'insert', label: 'Insert', needsValue: true },
  { id: 'search', label: 'Search', needsValue: true },
  { id: 'inorder', label: 'Inorder Traversal', needsValue: false },
  { id: 'preorder', label: 'Preorder Traversal', needsValue: false },
  { id: 'postorder', label: 'Postorder Traversal', needsValue: false },
]

function makeInitialTree() {
  let nodes = {}
  let rootId = null
  ;[50, 30, 70, 20, 40].forEach((v) => {
    const result = insertTrace(nodes, rootId, v)
    nodes = result.nodes
    rootId = result.rootId
  })
  return { nodes, rootId }
}

function BSTVisualizer() {
  const [tree] = useState(() => makeInitialTree())
  const [nodes, setNodes] = useState(tree.nodes)
  const [rootId, setRootId] = useState(tree.rootId)
  const [operation, setOperation] = useState('insert')
  const [valueText, setValueText] = useState('')
  const [error, setError] = useState('')

  const [steps, setSteps] = useState([{ nodes: tree.nodes, rootId: tree.rootId, current: null, highlight: [], visited: [], description: 'Ready — pick an operation' }])
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

    let result
    if (operation === 'insert') result = insertTrace(nodes, rootId, value)
    else if (operation === 'search') result = searchTrace(nodes, rootId, value)
    else result = traversalTrace(nodes, rootId, operation)

    setSteps(result.steps)
    setCurrentStep(0)
    setIsPlaying(false)
    setNodes(result.nodes)
    setRootId(result.rootId)
  }

  useEffect(() => {
    if (!isPlaying) return
    if (currentStep >= steps.length - 1) { setIsPlaying(false); return }
    const delay = 700 / speed
    const timer = setTimeout(() => setCurrentStep((s) => s + 1), delay)
    return () => clearTimeout(timer)
  }, [isPlaying, currentStep, steps, speed])

  const step = steps[currentStep]
  const positions = computeLayout(step.nodes, step.rootId)
  const nodeIds = Object.keys(step.nodes)
  const maxX = nodeIds.length ? Math.max(...Object.values(positions).map((p) => p.x)) : 0
  const maxY = nodeIds.length ? Math.max(...Object.values(positions).map((p) => p.y)) : 0
  const spacing = 80
  const width = (maxX + 1) * spacing + 40
  const height = (maxY + 1) * spacing + 60

  function px(id) {
    const p = positions[id]
    return { x: 20 + p.x * spacing + spacing / 2, y: 30 + p.y * spacing }
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-8">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Binary Search Tree</h3>

      <div className="flex flex-wrap gap-2 mb-2 justify-center">
        <select value={operation} onChange={(e) => setOperation(e.target.value)} className="border border-slate-300 rounded-lg px-3 py-2 text-sm">
          {OPERATIONS.map((op) => (<option key={op.id} value={op.id}>{op.label}</option>))}
        </select>

        {selectedOp.needsValue && (
          <input type="text" value={valueText} onChange={(e) => setValueText(e.target.value)} placeholder="Value" className="w-28 border border-slate-300 rounded-lg px-3 py-2 text-sm" />
        )}

        <button onClick={handleRun} className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm">Run</button>
      </div>
      {error && <p className="text-red-500 text-xs mb-4 text-center">{error}</p>}

      <div className="flex justify-center overflow-x-auto py-4">
        <div className="relative" style={{ width, height }}>
          <svg width={width} height={height} className="absolute top-0 left-0">
            {nodeIds.map((id) => {
              const node = step.nodes[id]
              const from = px(id)
              return (
                <g key={id}>
                  {node.left !== null && positions[node.left] && (
                    <line x1={from.x} y1={from.y} x2={px(node.left).x} y2={px(node.left).y} stroke="#cbd5e1" strokeWidth="2" />
                  )}
                  {node.right !== null && positions[node.right] && (
                    <line x1={from.x} y1={from.y} x2={px(node.right).x} y2={px(node.right).y} stroke="#cbd5e1" strokeWidth="2" />
                  )}
                </g>
              )
            })}
          </svg>

          <AnimatePresence initial={false}>
            {nodeIds.map((id) => {
              const node = step.nodes[id]
              const pos = px(id)
              let boxStyle = 'bg-white border-slate-300 text-slate-700'
              if (step.visited.includes(id)) boxStyle = 'bg-teal-100 border-teal-400 text-teal-700'
              if (step.highlight.includes(id)) boxStyle = 'bg-green-100 border-green-400 text-green-700'
              else if (id === step.current) boxStyle = 'bg-amber-100 border-amber-400 text-amber-700'

              return (
                <motion.div
                  key={id}
                  layout
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className={`absolute w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold text-sm ${boxStyle}`}
                  style={{ left: pos.x - 24, top: pos.y - 24 }}
                >
                  {node.value}
                </motion.div>
              )
            })}
          </AnimatePresence>
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
            <button key={option} onClick={() => setSpeed(option)} className={`px-2 py-1 text-xs rounded-md ${speed === option ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>{option}x</button>
          ))}
        </div>

        <span className="text-xs text-slate-400 ml-auto">Step {currentStep + 1} / {steps.length}</span>
      </div>
    </div>
  )
}

export default BSTVisualizer