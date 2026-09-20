import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeftRight, Check, X } from 'lucide-react'
import { VisualizationShell, TopicNotes, useSimulationEngine } from '../../simulation'
import { STUDENTS, COURSES, JOIN_TYPES, buildSqlJoinSteps, sqlJoinNotes } from '../../simulation-data/sqlJoins'

function rowTone(isFocused, matched) {
  if (!isFocused) return 'bg-white border-slate-100'
  if (matched === true) return 'bg-teal-50 border-teal-300'
  if (matched === false) return 'bg-rose-50 border-rose-300'
  return 'bg-blue-50 border-blue-300'
}

function StudentsTable({ focus }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden flex-1 min-w-[220px]">
      <div className="bg-slate-800 text-white text-xs font-bold px-3 py-2">Students</div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-400 text-xs">
            <th className="px-3 py-1.5 font-semibold">id</th>
            <th className="px-3 py-1.5 font-semibold">name</th>
            <th className="px-3 py-1.5 font-semibold">courseId</th>
          </tr>
        </thead>
        <tbody>
          {STUDENTS.map((s) => {
            const isFocused = focus?.studentId === s.id
            return (
              <motion.tr
                key={s.id}
                animate={{ scale: isFocused ? 1.02 : 1 }}
                className={`border-t transition-colors ${rowTone(isFocused, isFocused ? focus.matched : null)}`}
              >
                <td className="px-3 py-1.5 text-slate-600">{s.id}</td>
                <td className="px-3 py-1.5 font-medium text-slate-800">{s.name}</td>
                <td className="px-3 py-1.5 text-slate-600">{s.courseId ?? <span className="italic text-slate-400">NULL</span>}</td>
              </motion.tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function CoursesTable({ focus }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden flex-1 min-w-[220px]">
      <div className="bg-slate-800 text-white text-xs font-bold px-3 py-2">Courses</div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-400 text-xs">
            <th className="px-3 py-1.5 font-semibold">id</th>
            <th className="px-3 py-1.5 font-semibold">title</th>
          </tr>
        </thead>
        <tbody>
          {COURSES.map((c) => {
            const isFocused = focus?.courseId === c.id
            return (
              <motion.tr
                key={c.id}
                animate={{ scale: isFocused ? 1.02 : 1 }}
                className={`border-t transition-colors ${rowTone(isFocused, isFocused ? focus.matched : null)}`}
              >
                <td className="px-3 py-1.5 text-slate-600">{c.id}</td>
                <td className="px-3 py-1.5 font-medium text-slate-800">{c.title}</td>
              </motion.tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function MatchIndicator({ focus }) {
  return (
    <div className="flex flex-col items-center justify-center w-12 shrink-0">
      <AnimatePresence mode="wait">
        {focus && (
          <motion.div
            key={`${focus.studentId}-${focus.courseId}-${focus.matched}`}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              focus.matched === true ? 'bg-teal-500 text-white av-glow-success' : focus.matched === false ? 'bg-rose-400 text-white av-glow-danger' : 'bg-blue-500 text-white av-glow'
            }`}
          >
            {focus.matched === true ? <Check size={16} /> : focus.matched === false ? <X size={16} /> : <ArrowLeftRight size={14} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ResultTable({ rows }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden mt-4">
      <div className="bg-blue-700 text-white text-xs font-bold px-3 py-2">Result</div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-400 text-xs">
            <th className="px-3 py-1.5 font-semibold">name</th>
            <th className="px-3 py-1.5 font-semibold">title</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence initial={false}>
            {rows.map((row, i) => (
              <motion.tr
                key={`${row.studentId}-${row.courseId}-${i}`}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-t"
              >
                <td className="px-3 py-1.5 text-slate-700">{row.name ?? <span className="italic text-slate-400">NULL</span>}</td>
                <td className="px-3 py-1.5 text-slate-700">{row.courseTitle ?? <span className="italic text-slate-400">NULL</span>}</td>
              </motion.tr>
            ))}
          </AnimatePresence>
          {rows.length === 0 && (
            <tr><td colSpan={2} className="px-3 py-3 text-slate-400 italic text-xs">No rows yet</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

function SqlJoinsVisualizer() {
  const [joinType, setJoinType] = useState('INNER')
  const steps = useMemo(() => buildSqlJoinSteps(joinType), [joinType])
  const engine = useSimulationEngine(steps)
  const { state } = engine.currentStep

  return (
    <>
      <VisualizationShell
        title="SQL JOINs"
        subtitle="SELECT s.name, c.title FROM Students s JOIN Courses c ON s.courseId = c.id"
        engine={engine}
        legend={[
          { label: 'Matched', color: 'bg-teal-500' },
          { label: 'No match', color: 'bg-rose-400' },
          { label: 'Scanning', color: 'bg-blue-500' },
        ]}
        canvas={
          <div className="min-w-[520px]">
            <div className="flex justify-center gap-2 mb-4">
              {JOIN_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setJoinType(type)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-full transition-colors ${
                    joinType === type ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {type} JOIN
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <StudentsTable focus={state.focus} />
              <MatchIndicator focus={state.focus} />
              <CoursesTable focus={state.focus} />
            </div>
            <ResultTable rows={state.resultRows} />
          </div>
        }
        footnote="Switching the join type resets the simulation, since each join type scans and decides rows differently."
      />
      <TopicNotes notes={sqlJoinNotes} />
    </>
  )
}

export default SqlJoinsVisualizer
