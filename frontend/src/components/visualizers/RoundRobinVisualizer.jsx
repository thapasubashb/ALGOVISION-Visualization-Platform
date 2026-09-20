import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cpu } from 'lucide-react'
import { VisualizationShell, TopicNotes, useSimulationEngine } from '../../simulation'
import { PROCESSES, QUANTUM, PROCESS_COLORS, buildRoundRobinSteps, roundRobinNotes } from '../../simulation-data/roundRobin'

function ProcessChip({ id, highlight, justArrived }) {
  return (
    <motion.div
      layout
      initial={justArrived ? { opacity: 0, y: -12 } : false}
      animate={{ opacity: 1, y: 0, scale: highlight ? 1.1 : 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className={`w-12 h-12 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm ${PROCESS_COLORS[id]} ${highlight ? 'ring-2 ring-offset-2 ring-blue-400' : ''}`}
    >
      {id}
    </motion.div>
  )
}

function ReadyQueue({ queue, justArrived }) {
  return (
    <div className="flex-1">
      <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Ready Queue (front → back)</p>
      <div className="flex items-center gap-2 min-h-[52px] bg-white rounded-lg border border-dashed border-slate-200 p-2">
        <AnimatePresence initial={false}>
          {queue.length === 0 && <span className="text-xs text-slate-300 italic px-2">empty</span>}
          {queue.map((id) => (
            <ProcessChip key={id} id={id} justArrived={justArrived?.includes(id)} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

function CpuBox({ runningId }) {
  return (
    <div className="flex flex-col items-center gap-2 w-28 shrink-0">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">CPU</p>
      <div className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center border-2 transition-colors ${
        runningId ? 'bg-blue-50 border-blue-300 av-glow' : 'bg-slate-50 border-slate-200'
      }`}>
        <Cpu size={22} className={runningId ? 'text-blue-600' : 'text-slate-300'} />
        <AnimatePresence mode="wait">
          <motion.span
            key={runningId || 'idle'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs font-bold text-slate-700 mt-1"
          >
            {runningId || 'idle'}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  )
}

function RemainingBursts({ remaining }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {PROCESSES.map((p) => {
        const pct = Math.max(0, (remaining[p.id] / p.burst) * 100)
        return (
          <div key={p.id} className="bg-white rounded-lg border border-slate-100 p-2">
            <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1">
              <span>{p.id}</span>
              <span>{remaining[p.id]}/{p.burst}</span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <motion.div animate={{ width: `${pct}%` }} className={`h-full ${PROCESS_COLORS[p.id]}`} />
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
              className={`flex items-center justify-center text-[11px] font-bold text-white border-r border-white/40 ${PROCESS_COLORS[seg.id]}`}
              style={{ flexGrow: 0, flexShrink: 0 }}
            >
              {seg.id}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="flex justify-between text-[10px] text-slate-400 mt-1">
        <span>0</span>
        <span>t = {time}</span>
      </div>
    </div>
  )
}

function FinalMetricsTable({ finalMetrics, avgWaiting, avgTurnaround }) {
  if (!finalMetrics) return null
  return (
    <div className="mt-4 bg-white rounded-lg border border-slate-200 overflow-x-auto">
      <table className="w-full text-xs sm:text-sm">
        <thead>
          <tr className="text-left text-slate-400 border-b">
            <th className="px-3 py-2 font-semibold">Process</th>
            <th className="px-3 py-2 font-semibold">Arrival</th>
            <th className="px-3 py-2 font-semibold">Burst</th>
            <th className="px-3 py-2 font-semibold">Completion</th>
            <th className="px-3 py-2 font-semibold">Turnaround</th>
            <th className="px-3 py-2 font-semibold">Waiting</th>
          </tr>
        </thead>
        <tbody>
          {finalMetrics.map((m) => (
            <tr key={m.id} className="border-b last:border-0">
              <td className="px-3 py-2 font-bold text-slate-700">{m.id}</td>
              <td className="px-3 py-2 text-slate-600">{m.arrival}</td>
              <td className="px-3 py-2 text-slate-600">{m.burst}</td>
              <td className="px-3 py-2 text-slate-600">{m.completion}</td>
              <td className="px-3 py-2 text-slate-600">{m.turnaround}</td>
              <td className="px-3 py-2 text-slate-600">{m.waiting}</td>
            </tr>
          ))}
          <tr className="bg-slate-50 font-bold">
            <td className="px-3 py-2 text-slate-700" colSpan={4}>Average</td>
            <td className="px-3 py-2 text-slate-700">{avgTurnaround}</td>
            <td className="px-3 py-2 text-slate-700">{avgWaiting}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

function RoundRobinVisualizer() {
  const steps = useMemo(() => buildRoundRobinSteps(), [])
  const engine = useSimulationEngine(steps)
  const { state } = engine.currentStep

  const completedCount = Object.keys(state.completion || {}).length

  return (
    <>
      <VisualizationShell
        title="Round Robin CPU Scheduling"
        subtitle={`Time quantum = ${QUANTUM} units — 4 processes with different arrival and burst times`}
        engine={engine}
        legend={PROCESSES.map((p) => ({ label: p.id, color: PROCESS_COLORS[p.id] }))}
        metrics={[
          { label: 'Clock', value: `t = ${state.time}` },
          { label: 'Completed', value: `${completedCount} / ${PROCESSES.length}`, accent: completedCount === PROCESSES.length ? 'text-teal-600' : undefined },
          { label: 'Avg Waiting', value: state.avgWaiting ?? '—' },
        ]}
        canvas={
          <div className="min-w-[480px] flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <ReadyQueue queue={state.queue} justArrived={state.justArrived} />
              <CpuBox runningId={state.runningId} />
            </div>
            <RemainingBursts remaining={state.remaining} />
            <GanttChart gantt={state.gantt} time={Math.max(state.time, 1)} />
            <FinalMetricsTable finalMetrics={state.finalMetrics} avgWaiting={state.avgWaiting} avgTurnaround={state.avgTurnaround} />
          </div>
        }
        footnote="Sample workload: P1(arrival 0, burst 5), P2(1, 4), P3(2, 2), P4(4, 1)."
      />
      <TopicNotes notes={roundRobinNotes} />
    </>
  )
}

export default RoundRobinVisualizer
