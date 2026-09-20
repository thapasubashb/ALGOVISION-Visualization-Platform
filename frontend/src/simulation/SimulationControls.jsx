import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react'

function IconButton({ onClick, disabled, label, children, variant = 'ghost' }) {
  const base = 'flex items-center justify-center rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed'
  const variants = {
    ghost: 'w-10 h-10 bg-slate-100 text-slate-600 hover:bg-slate-200',
    primary: 'w-12 h-12 bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-300/40',
  }
  return (
    <button type="button" onClick={onClick} disabled={disabled} aria-label={label} title={label} className={`${base} ${variants[variant]}`}>
      {children}
    </button>
  )
}

function Timeline({ engine }) {
  const { currentIndex, totalSteps, goToStep } = engine
  return (
    <div className="flex items-center gap-1 w-full" role="slider" aria-valuemin={0} aria-valuemax={totalSteps - 1} aria-valuenow={currentIndex}>
      {Array.from({ length: totalSteps }).map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => goToStep(i)}
          aria-label={`Go to step ${i + 1}`}
          className={`h-1.5 flex-1 rounded-full transition-colors cursor-pointer ${
            i <= currentIndex ? 'bg-blue-500' : 'bg-slate-200 hover:bg-slate-300'
          }`}
        />
      ))}
    </div>
  )
}

/**
 * Shared control bar for every simulation: Restart / Previous / Play-Pause /
 * Next, a speed selector, a scrubbable timeline, and the step counter.
 * Every topic wires this to the same `useSimulationEngine` return value, so
 * behaviour (and the visual language) is identical across all 30 topics.
 */
function SimulationControls({ engine }) {
  const { isPlaying, isFirstStep, isLastStep, currentIndex, totalSteps, speed, speedOptions, setSpeed, togglePlay, next, previous, restart } = engine

  return (
    <div className="flex flex-col gap-3">
      <Timeline engine={engine} />

      <div className="flex items-center gap-3 flex-wrap">
        <IconButton onClick={restart} label="Restart">
          <RotateCcw size={16} />
        </IconButton>
        <IconButton onClick={previous} disabled={isFirstStep} label="Previous step">
          <SkipBack size={16} />
        </IconButton>
        <IconButton onClick={togglePlay} variant="primary" label={isPlaying ? 'Pause' : 'Play'}>
          {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
        </IconButton>
        <IconButton onClick={next} disabled={isLastStep} label="Next step">
          <SkipForward size={16} />
        </IconButton>

        <div className="flex items-center gap-1 ml-1">
          <span className="text-xs text-slate-400 mr-1">Speed</span>
          {speedOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setSpeed(option)}
              className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors ${
                speed === option ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {option}x
            </button>
          ))}
        </div>

        <span className="text-xs font-semibold text-slate-400 ml-auto whitespace-nowrap">
          Step {currentIndex + 1} / {totalSteps}
        </span>
      </div>
    </div>
  )
}

export default SimulationControls
