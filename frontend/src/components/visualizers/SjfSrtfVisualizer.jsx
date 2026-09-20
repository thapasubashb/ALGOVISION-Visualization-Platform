import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cpu } from 'lucide-react'
import { VisualizationShell, TopicNotes, StatusBadge, useSimulationEngine } from '../../simulation'
import { SJF_PROCESSES, SJF_COLORS, buildSjfSrtfSteps, sjfSrtfNotes } from '../../simulation-data/sjfSrtf'

function RemainingBursts({ remaining }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {SJF_PROCESSES.map((p) => {
        const pct = Math.max(0, (remaining[p.id] / p.burst) * 100)
        return (
          <div key={p.id} className="bg-white rounded-lg border border-slate-100 p-2">
            <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1">
              <span>{p.id}</span><span>{remaining[p.id]}/{p.burst}</span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <motion.div animate={{ width: `${pct}%` }} className={`h-full ${SJF_COLORS[p.id]}`} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

function GanttChart({ gantt, time }) {
  const totalTime = Math.max(time, 1)
  return (
    <div>
      <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Gantt Chart</p>
      <div className="flex h-10 rounded-lg overflow-hidden border border-slate-200 bg-white">
        <AnimatePresence initial={false}>
          {gantt.map((seg, i) => (
            <motion.div
              key={i}
              initial={{ flexBasis: 0, opacity: 0 }}
              animate={{ flexBasis: `${((seg.end - seg.start) / totalTime) * 100}%`, opacity: 1 }}
              className={`flex items-center justify-center text-[10px] font-bold text-white border-r border-white/40 ${SJF_COLORS[seg.id]}`}
              style={{ flexGrow: 0, flexShrink: 0 }}
            >
              {seg.id}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="flex justify-between text-[10px] text-slate-400 mt-1"><span>0</span><span>t = {time}</span></div>
    </div>
  )
}

function SjfSrtfVisualizer() {
  const steps = useMemo(() => buildSjfSrtfSteps(), [])
  const engine = useSimulationEngine(steps)
  const { state } = engine.currentStep
  const completedCount = Object.keys(state.completion || {}).length

  return (
    <>
      <VisualizationShell
        title="SJF / SRTF Scheduling"
        subtitle="Preemptive shortest-remaining-time-first — same workload as FCFS and Round Robin"
        engine={engine}
        legend={SJF_PROCESSES.map((p) => ({ label: p.id, color: SJF_COLORS[p.id] }))}
        metrics={[
          { label: 'Clock', value: `t = ${state.time}` },
          { label: 'Completed', value: `${completedCount} / ${SJF_PROCESSES.length}` },
          { label: 'Avg Waiting', value: state.avgWaiting ?? '—' },
        ]}
        canvas={
          <div className="min-w-[480px] flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <RemainingBursts remaining={state.remaining} />
              <div className="flex flex-col items-center gap-2 w-24 shrink-0">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">CPU</p>
                <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center border-2 ${state.runningId ? 'bg-blue-50 border-blue-300 av-glow' : 'bg-slate-50 border-slate-200'}`}>
                  <Cpu size={18} className={state.runningId ? 'text-blue-600' : 'text-slate-300'} />
                  <span className="text-[11px] font-bold text-slate-700 mt-1">{state.runningId || 'idle'}</span>
                </div>
              </div>
            </div>
            {state.preemptionNote && (
              <StatusBadge tone="warning">{state.preemptionNote}</StatusBadge>
            )}
            <GanttChart gantt={state.gantt} time={Math.max(state.time, 1)} />
          </div>
        }
      />
      <TopicNotes notes={sjfSrtfNotes} />
    </>
  )
}

export default SjfSrtfVisualizer
