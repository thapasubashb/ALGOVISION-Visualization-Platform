import { useState, useEffect } from 'react'

function ComparisonPanel({ label, steps, getBarColor, isPlaying, speed }) {
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    if (!isPlaying) return
    if (currentStep >= steps.length - 1) return
    const delay = 500 / speed
    const timer = setTimeout(() => setCurrentStep((s) => s + 1), delay)
    return () => clearTimeout(timer)
  }, [isPlaying, currentStep, steps, speed])

  const step = steps[currentStep]
  const maxValue = Math.max(...step.array)
  const isDone = currentStep === steps.length - 1

  return (
    <div className="bg-white rounded-xl shadow-md p-5 flex-1 min-w-0">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-bold text-slate-800">{label}</h4>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${isDone ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
          {isDone ? 'Finished' : `Step ${currentStep + 1} / ${steps.length}`}
        </span>
      </div>

      <div className="flex gap-1.5 h-48 mb-4">
        {step.array.map((value, index) => (
          <div key={index} className="flex flex-col items-center justify-end flex-1 h-full">
            <div
              className={`w-full rounded-t-md transition-all duration-300 ${getBarColor(step, index)}`}
              style={{ height: `${Math.max((value / maxValue) * 100, 4)}%` }}
            />
            <span className="text-[10px] text-slate-500 mt-1">{value}</span>
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-500">{step.description}</p>
    </div>
  )
}

export default ComparisonPanel