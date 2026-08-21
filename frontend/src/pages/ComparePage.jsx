import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import ArrayInput from '../components/ArrayInput'
import ComparisonPanel from '../components/ComparisonPanel'
import { sortingAlgorithms } from '../data/sortingRegistry'

const SPEED_OPTIONS = [0.5, 1, 1.5, 2]
const DEFAULT_ARRAY = [8, 3, 6, 1, 9, 4, 2, 7]

function ComparePage() {
  const [array, setArray] = useState(DEFAULT_ARRAY)
  const [algoA, setAlgoA] = useState('bubble-sort')
  const [algoB, setAlgoB] = useState('quick-sort')
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [runId, setRunId] = useState(0)

  const stepsA = useMemo(() => sortingAlgorithms[algoA].traceFn(array), [algoA, array])
  const stepsB = useMemo(() => sortingAlgorithms[algoB].traceFn(array), [algoB, array])

  function restart() {
    setIsPlaying(false)
    setRunId((id) => id + 1)
  }

  function handleNewArray(newArray) {
    setArray(newArray)
    restart()
  }

  return (
    <main className="max-w-5xl mx-auto px-6 pt-32 pb-16">
      <Link to="/dsa" className="text-sm text-blue-600 hover:underline">
        ← Back to all algorithms
      </Link>

      <h1 className="text-2xl font-bold text-slate-800 mt-4 mb-1" style={{ fontFamily: "'Sora', sans-serif" }}>
        Compare Sorting Algorithms
      </h1>
      <p className="text-sm text-slate-500 mb-6">
        Pick two algorithms, run the same array through both, and watch how their step counts differ.
      </p>

      <ArrayInput onSubmit={handleNewArray} />

      <div className="flex flex-wrap gap-4 items-center mb-6">
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-500 font-medium">Algorithm A</label>
          <select
            value={algoA}
            onChange={(e) => { setAlgoA(e.target.value); restart() }}
            className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm"
          >
            {Object.entries(sortingAlgorithms).map(([id, algo]) => (
              <option key={id} value={id} disabled={id === algoB}>{algo.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-500 font-medium">Algorithm B</label>
          <select
            value={algoB}
            onChange={(e) => { setAlgoB(e.target.value); restart() }}
            className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm"
          >
            {Object.entries(sortingAlgorithms).map(([id, algo]) => (
              <option key={id} value={id} disabled={id === algoA}>{algo.name}</option>
            ))}
          </select>
        </div>

        <button onClick={() => setIsPlaying((p) => !p)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold">
          {isPlaying ? 'Pause Both' : 'Play Both'}
        </button>
        <button onClick={restart} className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm">
          Reset
        </button>

        <div className="flex items-center gap-1 ml-auto">
          <span className="text-xs text-slate-400 mr-1">Speed:</span>
          {SPEED_OPTIONS.map((option) => (
            <button
              key={option}
              onClick={() => setSpeed(option)}
              className={`px-2 py-1 text-xs rounded-md ${speed === option ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              {option}x
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-5">
        <ComparisonPanel key={`a-${runId}`} label={sortingAlgorithms[algoA].name} steps={stepsA} getBarColor={sortingAlgorithms[algoA].getBarColor} isPlaying={isPlaying} speed={speed} />
        <ComparisonPanel key={`b-${runId}`} label={sortingAlgorithms[algoB].name} steps={stepsB} getBarColor={sortingAlgorithms[algoB].getBarColor} isPlaying={isPlaying} speed={speed} />
      </div>
    </main>
  )
}

export default ComparePage