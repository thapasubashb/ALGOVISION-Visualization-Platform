import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { VisualizationShell, TopicNotes, MetricPanel, useSimulationEngine } from '../../simulation'
import { buildCongestionSteps, congestionNotes } from '../../simulation-data/congestion'

const PHASE_COLOR = {
  'slow-start': 'bg-blue-500',
  'transition': 'bg-purple-500',
  'congestion-avoidance': 'bg-teal-500',
  'loss': 'bg-rose-500',
  'summary': 'bg-slate-400',
}

function CongestionVisualizer() {
  const steps = useMemo(() => buildCongestionSteps(), [])
  const engine = useSimulationEngine(steps)
  const { state } = engine.currentStep
  const maxVal = Math.max(...state.history, state.ssthresh, 1)

  return (
    <>
      <VisualizationShell
        title="TCP Congestion Control"
        subtitle="Congestion window (cwnd) growing, hitting a loss event, and recovering"
        engine={engine}
        legend={[
          { label: 'Slow start', color: 'bg-blue-500' },
          { label: 'Congestion avoidance', color: 'bg-teal-500' },
          { label: 'Loss event', color: 'bg-rose-500' },
        ]}
        metrics={[
          { label: 'cwnd', value: state.cwnd },
          { label: 'ssthresh', value: state.ssthresh },
          { label: 'Phase', value: state.phase.replace('-', ' '), accent: state.phase === 'loss' ? 'text-rose-600' : undefined },
        ]}
        canvas={
          <div className="min-w-[480px]">
            <div className="flex items-end gap-1.5 h-48 border-b border-l border-slate-200 pl-2 pb-1 relative">
              <div
                className="absolute left-2 right-0 border-t-2 border-dashed border-amber-300"
                style={{ bottom: `${(state.ssthresh / maxVal) * 100}%` }}
              >
                <span className="absolute -top-4 right-0 text-[9px] text-amber-500 font-bold">ssthresh</span>
              </div>
              <AnimatePresence initial={false}>
                {state.history.map((val, i) => (
                  <motion.div
                    key={i}
                    layout
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: `${(val / maxVal) * 100}%`, opacity: 1 }}
                    className={`w-6 rounded-t-sm ${i === state.history.length - 1 ? PHASE_COLOR[state.phase] + ' av-glow' : 'bg-slate-200'}`}
                    title={`Round ${i + 1}: cwnd=${val}`}
                  />
                ))}
              </AnimatePresence>
            </div>
            <p className="text-center text-[10px] text-slate-400 mt-1">Round trips →</p>
          </div>
        }
      />
      <TopicNotes notes={congestionNotes} />
    </>
  )
}

export default CongestionVisualizer
