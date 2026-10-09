import { useState } from 'react'
import { RotateCcw } from 'lucide-react'

/**
 * A small "customize the data" control shown below the playback controls
 * (or in the fullscreen sidebar). Pre-filled with the topic's default
 * values so it's clear what's being visualized from the start; typing
 * new comma-separated numbers and hitting Apply regenerates the whole
 * simulation with that data.
 */
function ArrayInput({ defaultValues, onApply, min = 2, max = 8, label = 'Custom array' }) {
  const [text, setText] = useState(defaultValues.join(', '))
  const [error, setError] = useState('')

  const apply = () => {
    const parsed = text
      .split(/[,\s]+/)
      .filter((t) => t.length > 0)
      .map((t) => Number(t))

    if (parsed.some((n) => Number.isNaN(n) || !Number.isInteger(n))) {
      setError('Please enter whole numbers only, separated by commas.')
      return
    }
    if (parsed.length < min || parsed.length > max) {
      setError(`Please enter between ${min} and ${max} numbers.`)
      return
    }
    if (parsed.some((n) => n < 0 || n > 999)) {
      setError('Please keep numbers between 0 and 999.')
      return
    }
    setError('')
    onApply(parsed)
  }

  const reset = () => {
    setText(defaultValues.join(', '))
    setError('')
    onApply(defaultValues)
  }

  return (
    <div>
      <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-2">{label}</p>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && apply()}
          placeholder={`e.g. ${defaultValues.join(', ')}`}
          className="flex-1 text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={apply}
            className="px-3 py-2 text-xs font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={reset}
            aria-label="Reset to default"
            title="Reset to default"
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>
      {error && <p className="text-xs text-rose-500 mt-1.5">{error}</p>}
    </div>
  )
}

export default ArrayInput
