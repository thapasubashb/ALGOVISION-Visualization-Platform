import { useState, useEffect } from 'react'

const SPEED_OPTIONS = [0.5, 1, 1.5, 2]

function SearchVisualizer({ title, initialArray, initialTarget, traceFn, getBarColor, note }) {
  const [steps, setSteps] = useState(() => traceFn(initialArray, initialTarget))
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [arrayText, setArrayText] = useState('')
  const [targetText, setTargetText] = useState('')
  const [error, setError] = useState('')

  function handleSubmit() {
    const parts = arrayText.split(',').map((p) => p.trim()).filter((p) => p !== '')
    if (parts.length === 0) { setError('Please enter at least one number'); return }
    const numbers = parts.map(Number)
    if (numbers.some((n) => isNaN(n))) { setError('Please only enter numbers, separated by commas'); return }
    if (numbers.length > 15) { setError('Please enter 15 numbers or fewer'); return }

    const target = Number(targetText)
    if (targetText.trim() === '' || isNaN(target)) { setError('Please enter a number to search for'); return }

    setError('')
    setSteps(traceFn(numbers, target))
    setCurrentStep(0)
    setIsPlaying(false)
  }

  useEffect(() => {
    if (!isPlaying) return
    if (currentStep >= steps.length - 1) { setIsPlaying(false); return }
    const delay = 700 / speed
    const timer = setTimeout(() => setCurrentStep((s) => s + 1), delay)
    return () => clearTimeout(timer)
  }, [isPlaying, currentStep, steps, speed])

  const step = steps[currentStep]
  const maxValue = Math.max(...step.array)

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-8">
      <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
      {note && <p className="text-xs text-slate-400 mb-4">{note}</p>}

      <div className="flex flex-wrap gap-2 mb-2">
        <input
          type="text"
          value={arrayText}
          onChange={(e) => setArrayText(e.target.value)}
          placeholder="e.g. 8, 3, 6, 1, 9, 4"
          className="flex-1 min-w-[180px] border border-slate-300 rounded-lg px-3 py-2 text-sm"
        />
        <input
          type="text"
          value={targetText}
          onChange={(e) => setTargetText(e.target.value)}
          placeholder="Search for..."
          className="w-32 border border-slate-300 rounded-lg px-3 py-2 text-sm"
        />
        <button onClick={handleSubmit} className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm">
          Visualize
        </button>
      </div>
      {error && <p className="text-red-500 text-xs mb-4">{error}</p>}
      {!error && <div className="mb-4" />}

      <div className="flex gap-2 h-64 mb-6">
        {step.array.map((value, index) => (
          <div key={index} className="flex flex-col items-center justify-end flex-1 h-full">
            <div
              className={`w-full rounded-t-md transition-all duration-300 ${getBarColor(step, index)}`}
              style={{ height: `${Math.max((value / maxValue) * 100, 4)}%` }}
            />
            <span className="text-xs text-slate-500 mt-1">{value}</span>
          </div>
        ))}
      </div>

      <p className="text-sm text-slate-600 mb-4">{step.description}</p>

      <div className="flex items-center gap-3 flex-wrap">
        <button onClick={() => setCurrentStep((s) => Math.max(0, s - 1))} disabled={currentStep === 0} className="px-3 py-2 bg-slate-200 rounded-lg disabled:opacity-40">Back</button>
        <button onClick={() => setIsPlaying((p) => !p)} className="px-4 py-2 bg-blue-600 text-white rounded-lg">{isPlaying ? 'Pause' : 'Play'}</button>
        <button onClick={() => setCurrentStep((s) => Math.min(steps.length - 1, s + 1))} disabled={currentStep === steps.length - 1} className="px-3 py-2 bg-slate-200 rounded-lg disabled:opacity-40">Next</button>
        <button onClick={() => { setCurrentStep(0); setIsPlaying(false) }} className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg">Reset</button>

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

export default SearchVisualizer