import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cpu } from 'lucide-react'
import { VisualizationShell, TopicNotes, useSimulationEngine } from '../../simulation'
import { PRIORITY_PROCESSES, PRIORITY_COLORS, buildPrioritySteps, priorityNotes } from '../../simulation-data/priorityScheduling'

function GanttChart({ gantt, time }) {
  const totalTime = Math.max(time, 1)
  return (
    <div>
      <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Gantt Chart</p>
      <div className="flex h-10 rounded-lg overflow-hidden border border-slate-200 bg-white">
        <AnimatePresence initial={false}>
          {gantt.map((seg, i) => (
            <motion.div key={i} initial={{ flexBasis: 0, opacity: 0 }} animate={{ flexBasis: `${((seg.end - seg.start) / totalTime) * 100}%`, opacity: 1 }}
              className={`flex items-center justify-center text-[10px] font-bold text-white border-r border-white/40 ${PRIORITY_COLORS[seg.id]}`} style={{ flexGrow: 0, flexShrink: 0 }}>
              {seg.id}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="flex justify-between text-[10px] text-slate-400 mt-1"><span>0</span><span>t = {time}</span></div>
    </div>
  )
}

function PrioritySchedulingVisualizer() {
  const steps = useMemo(() => buildPrioritySteps(), [])
  const engine = useSimulationEngine(steps)
  const { state } = engine.currentStep

  return (
    <>
      <VisualizationShell
        title="Priority Scheduling"
        subtitle="Non-preemptive — lower priority number always runs first among arrived processes"
        engine={engine}
        legend={PRIORITY_PROCESSES.map((p) => ({ label: `${p.id} (prio ${p.priority})`, color: PRIORITY_COLORS[p.id] }))}
        metrics={[
          { label: 'Clock', value: `t = ${state.time}` },
          { label: 'Avg Waiting', value: state.avgWaiting ?? '—' },
        ]}
        canvas={
          <div className="min-w-[480px] flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Considering</p>
                <div className="flex items-center gap-2 min-h-[52px] bg-white rounded-lg border border-dashed border-slate-200 p-2">
                  {state.considered.length === 0 && <span className="text-xs text-slate-300 italic px-2">—</span>}
                  <AnimatePresence initial={false}>
                    {state.considered.map((id) => {
                      const p = PRIORITY_PROCESSES.find((pp) => pp.id === id)
                      return (
                        <motion.div key={id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`flex flex-col items-center justify-center w-14 h-12 rounded-lg text-white text-[10px] font-bold ${PRIORITY_COLORS[id]}`}>
                          <span>{id}</span><span className="opacity-80">prio {p.priority}</span>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 w-24 shrink-0">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">CPU</p>
                <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center border-2 ${state.runningId ? 'bg-blue-50 border-blue-300 av-glow' : 'bg-slate-50 border-slate-200'}`}>
                  <Cpu size={18} className={state.runningId ? 'text-blue-600' : 'text-slate-300'} />
                  <span className="text-[11px] font-bold text-slate-700 mt-1">{state.runningId || 'idle'}</span>
                </div>
              </div>
            </div>
            <GanttChart gantt={state.gantt} time={Math.max(state.time, 1)} />
          </div>
        }
      />
      <TopicNotes notes={priorityNotes} />
    </>
  )
}

export default PrioritySchedulingVisualizer
