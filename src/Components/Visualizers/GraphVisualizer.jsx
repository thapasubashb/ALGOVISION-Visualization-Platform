import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NODE_IDS, adjacency, bfsTrace, dfsTrace } from '../../algorithms/graph'

const SPEED_OPTIONS = [0.5, 1, 1.5, 2]
const RADIUS = 100
const CENTER = 140

const positions = {}
NODE_IDS.forEach((id, i) => {
  const angle = (2 * Math.PI * i) / NODE_IDS.length - Math.PI / 2
  positions[id] = {
    x: CENTER + RADIUS * Math.cos(angle),
    y: CENTER + RADIUS * Math.sin(angle),
  }
})

const edgeList = []
const seenEdges = new Set()
NODE_IDS.forEach((id) => {
  adjacency[id].forEach((neighbor) => {
    const key = [id, neighbor].sort().join('-')
    if (!seenEdges.has(key)) {
      seenEdges.add(key)
      edgeList.push([id, neighbor])
    }
  })
})

function GraphVisualizer() {
  const [mode, setMode] = useState('bfs')
  const [startNode, setStartNode] = useState('A')
  const [steps, setSteps] = useState(() => bfsTrace('A'))
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)

 
  const step = steps[currentStep]

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-8">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Graph Traversal (BFS & DFS)</h3>

      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        <button onClick={() => setMode('bfs')} className={`px-4 py-2 rounded-lg text-sm font-semibold ${mode === 'bfs' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
          BFS (Queue)
        </button>
        <button onClick={() => setMode('dfs')} className={`px-4 py-2 rounded-lg text-sm font-semibold ${mode === 'dfs' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
          DFS (Stack)
        </button>
        <select value={startNode} onChange={(e) => setStartNode(e.target.value)} className="border border-slate-300 rounded-lg px-3 py-2 text-sm">
          {NODE_IDS.map((id) => (<option key={id} value={id}>Start at {id}</option>))}
        </select>
        <button onClick={handleRun} className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm">Run</button>
      </div>

      <div className="flex flex-col md:flex-row gap-8 justify-center items-center mb-6">
        <div className="relative" style={{ width: 280, height: 280 }}>
          <svg width="280" height="280" className="absolute top-0 left-0">
            {edgeList.map(([a, b]) => (
              <line key={`${a}-${b}`} x1={positions[a].x} y1={positions[a].y} x2={positions[b].x} y2={positions[b].y} stroke="#cbd5e1" strokeWidth="2" />
            ))}
          </svg>

          {NODE_IDS.map((id) => {
            let boxStyle = 'bg-white border-slate-300 text-slate-500'
            if (step.visited.includes(id)) boxStyle = 'bg-green-100 border-green-400 text-green-700'
            if (id === step.current) boxStyle = 'bg-amber-100 border-amber-400 text-amber-700'

            return (
              <div
                key={id}
                className={`absolute w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold transition-colors duration-300 ${boxStyle}`}
                style={{ left: positions[id].x - 24, top: positions[id].y - 24 }}
              >
                {id}
              </div>
            )
          })}
        </div>

        <div className="flex flex-col items-center">
          <p className="text-xs text-slate-400 mb-2">{mode === 'bfs' ? 'Queue (front → back)' : 'Stack (bottom → top)'}</p>
          <div className={`flex gap-2 ${mode === 'bfs' ? 'flex-row' : 'flex-col-reverse'} min-h-[56px]`}>
            <AnimatePresence initial={false}>
              {step.pending.map((id, i) => (
                <motion.div
                  key={`${id}-${i}`}
                  layout
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  className="w-12 h-12 rounded-lg border-2 border-sky-300 bg-sky-50 text-sky-700 flex items-center justify-center font-bold"
                >
                  {id}
                </motion.div>
              ))}
            </AnimatePresence>
            {step.pending.length === 0 && <span className="text-xs text-slate-300 italic">empty</span>}
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
            <button key={option} onClick={() => setSpeed(option)} className={`px-2 py-1 text-xs rounded-md ${speed === option ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>{option}x</button>
          ))}
        </div>

        <span className="text-xs text-slate-400 ml-auto">Step {currentStep + 1} / {steps.length}</span>
      </div>
    </div>
  )
}

export default GraphVisualizer