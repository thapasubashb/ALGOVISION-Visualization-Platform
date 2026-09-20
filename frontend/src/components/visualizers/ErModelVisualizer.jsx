import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { VisualizationShell, TopicNotes, useSimulationEngine } from '../../simulation'
import { buildErModelSteps, erModelNotes } from '../../simulation-data/erModel'

function EntityBox({ title, attrs, show, showAttrs, pkFirst = true }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          className="bg-white border-2 border-slate-700 rounded-lg px-5 py-3 shadow-sm w-48"
        >
          <p className="text-center font-bold text-slate-800 text-sm mb-1">{title}</p>
          <AnimatePresence>
            {showAttrs && (
              <motion.ul
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-xs text-slate-600 space-y-0.5 overflow-hidden"
              >
                {attrs.map((a, i) => (
                  <li key={a} className={`text-center ${i === 0 && pkFirst ? 'underline font-semibold text-slate-800' : ''}`}>
                    {a}
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function ErModelVisualizer() {
  const steps = useMemo(() => buildErModelSteps(), [])
  const engine = useSimulationEngine(steps)
  const { state } = engine.currentStep

  return (
    <>
      <VisualizationShell
        title="ER Model"
        subtitle="STUDENT enrolls in COURSE — building an entity-relationship diagram piece by piece"
        engine={engine}
        legend={[
          { label: 'Entity', color: 'bg-slate-700' },
          { label: 'Relationship', color: 'bg-purple-500' },
          { label: 'Primary key (underlined)', color: 'bg-slate-400' },
        ]}
        canvas={
          <div className="min-w-[520px] flex flex-col items-center gap-4 py-4">
            <div className="flex items-center justify-center gap-10">
              <EntityBox title="STUDENT" attrs={['student_id (PK)', 'name', 'email']} show={state.showStudent} showAttrs={state.showStudentAttrs} />

              <AnimatePresence>
                {state.showRelation && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative flex items-center justify-center"
                  >
                    <div
                      className="bg-purple-50 border-2 border-purple-400 flex items-center justify-center text-xs font-bold text-purple-700 av-glow"
                      style={{ width: 110, height: 70, clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
                    >
                      ENROLLS
                    </div>
                    {state.showCardinality && (
                      <>
                        <span className="absolute -left-6 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">M</span>
                        <span className="absolute -right-6 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">N</span>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <EntityBox title="COURSE" attrs={['course_id (PK)', 'title', 'credits']} show={state.showCourse} showAttrs={state.showCourseAttrs} />
            </div>

            <AnimatePresence>
              {state.showJunction && (
                <motion.div
                  initial={{ opacity: 0, y: -14 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 bg-teal-50 border-2 border-teal-400 rounded-lg px-5 py-3 text-center"
                >
                  <p className="font-bold text-teal-800 text-sm mb-1">Enrollment (junction table)</p>
                  <p className="text-xs text-teal-700">student_id (FK) &nbsp;•&nbsp; course_id (FK) &nbsp;•&nbsp; enrollment_date</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        }
      />
      <TopicNotes notes={erModelNotes} />
    </>
  )
}

export default ErModelVisualizer
