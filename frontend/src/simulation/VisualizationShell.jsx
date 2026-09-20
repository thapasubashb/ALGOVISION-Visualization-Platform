import { useEffect, useState } from 'react'
import { Maximize2, Minimize2 } from 'lucide-react'
import SimulationControls from './SimulationControls'
import StepExplanation from './StepExplanation'
import { MetricPanel, Legend } from './MetricPanel'

/**
 * The one wrapper every DBMS / CN / OS topic renders inside.
 *
 * It reuses the exact card language already used across AlgoVision
 * (white rounded-xl card, shadow-md, slate text) so a DBMS page looks
 * like it was built by the same team as the DSA pages, while giving
 * every topic: a title/subtitle, a canvas region for its own renderer,
 * a legend, live metrics, the synced explanation panel, and the shared
 * playback controls.
 *
 * It also supports a "maximize" mode (the icon button next to the title):
 * the canvas takes over the screen, the explanation/legend/metrics move
 * into a right-hand sidebar, and every control (play/pause/restart/speed/
 * timeline) docks into a bottom bar -- good for projecting on a classroom
 * screen. Since every topic renders through this one component, this
 * behavior is automatically available on all 30 visualizations.
 */
function VisualizationShell({ title, subtitle, legend, metrics, engine, canvas, footnote }) {
  const { currentStep, currentIndex } = engine
  const [isMaximized, setIsMaximized] = useState(false)

  useEffect(() => {
    if (!isMaximized) return undefined
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setIsMaximized(false)
    }
    document.addEventListener('keydown', onKeyDown)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prevOverflow
    }
  }, [isMaximized])

  if (isMaximized) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col">
        <div className="flex items-start justify-between gap-4 px-5 sm:px-6 py-3 border-b border-slate-100 shrink-0">
          <div>
            <h3 className="text-lg font-bold text-slate-800">{title}</h3>
            {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={() => setIsMaximized(false)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-lg px-3 py-2 shrink-0"
          >
            <Minimize2 size={14} />
            Exit full screen
          </button>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          <div className="flex-1 av-grid-bg bg-gradient-to-b from-sky-50 to-white overflow-auto flex items-center justify-center p-6">
            {canvas}
          </div>

          <div className="w-full lg:w-80 shrink-0 border-t lg:border-t-0 lg:border-l border-slate-100 flex flex-col overflow-y-auto p-4 gap-4">
            <Legend items={legend} />
            {metrics && <MetricPanel metrics={metrics} />}
            <StepExplanation step={currentStep} stepIndex={currentIndex} />
            {footnote && <p className="text-xs text-slate-400">{footnote}</p>}
          </div>
        </div>

        <div className="shrink-0 border-t border-slate-100 px-5 sm:px-6 py-3 bg-white">
          <SimulationControls engine={engine} />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-5 sm:p-6 mt-6">
      <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
        <div>
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-3">
          <Legend items={legend} />
          <button
            type="button"
            onClick={() => setIsMaximized(true)}
            aria-label="Maximize"
            title="Full screen"
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 shrink-0"
          >
            <Maximize2 size={14} />
          </button>
        </div>
      </div>

      <div className="av-grid-bg bg-gradient-to-b from-sky-50 to-white border border-slate-100 rounded-xl p-4 sm:p-6 mb-4 overflow-x-auto">
        {canvas}
      </div>

      {metrics && <div className="mb-4"><MetricPanel metrics={metrics} /></div>}

      <div className="mb-4">
        <StepExplanation step={currentStep} stepIndex={currentIndex} />
      </div>

      <SimulationControls engine={engine} />

      {footnote && <p className="text-xs text-slate-400 mt-4">{footnote}</p>}
    </div>
  )
}

export default VisualizationShell
