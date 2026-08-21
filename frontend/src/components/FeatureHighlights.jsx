import { motion } from 'framer-motion'
import Scene3DBackground from './Scene3DBackground'
import { buildFeatureScene } from '../three/featureScene'

const features = [
  { number: '01', title: 'Step through it, your way', description: 'Play, pause, step forward or back, and control speed from 0.5x to 2x.' },
  { number: '02', title: 'Use your own data', description: 'Type your own numbers and watch the same algorithm run on them, not a fixed demo.' },
  { number: '03', title: "Ask, right when you're confused", description: 'An AI tutor sits alongside every visualizer, aware of exactly what step you\'re on.' },
  { number: '04', title: 'One visual language, everywhere', description: 'The same color coding for compare, swap, and sorted — across every single algorithm.' },
  { number: '05', title: 'Beyond just DSA', description: 'Operating Systems, Computer Networks, and DBMS modules are on the way, same engine.' },
  { number: '06', title: 'Free, always', description: 'No paywalls, no signup walls — built for learning, not for locking content behind a login.' },
]

const variants = [
  { card: 'bg-sky-50/50 border-sky-200/70', badge: 'bg-sky-500/15 text-sky-700 border-sky-300/50', title: 'from-sky-600 to-cyan-500', text: 'text-sky-900/70' },
  { card: 'bg-blue-50/50 border-blue-200/70', badge: 'bg-blue-500/15 text-blue-700 border-blue-300/50', title: 'from-blue-600 to-indigo-500', text: 'text-blue-900/70' },
  { card: 'bg-cyan-50/50 border-cyan-200/70', badge: 'bg-cyan-500/15 text-cyan-700 border-cyan-300/50', title: 'from-cyan-600 to-sky-500', text: 'text-cyan-900/70' },
]

function FeatureHighlights() {
  return (
    <section className="min-h-screen bg-sky-100 flex flex-col justify-center py-24 px-6 relative overflow-hidden">
      <Scene3DBackground buildScene={buildFeatureScene} cameraZ={12} />

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-bold text-slate-900 text-center mb-16"
          style={{ fontFamily: "'Sora', sans-serif" }}
        >
          Built to actually make it click
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const v = variants[i % variants.length]
            return (
              <motion.div
                key={f.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className={`backdrop-blur-md border rounded-xl p-6 shadow-md shadow-blue-100/60 hover:shadow-lg transition-shadow ${v.card}`}
              >
                <div className={`w-9 h-9 rounded-full border flex items-center justify-center font-bold text-xs mb-4 ${v.badge}`}>
                  {f.number}
                </div>
                <h3
                  className={`text-lg font-bold mb-2 bg-linear-to-r ${v.title} bg-clip-text text-transparent`}
                  style={{ fontFamily: "'Sora', sans-serif" }}
                >
                  {f.title}
                </h3>
                <p className={`text-sm leading-relaxed ${v.text}`}>{f.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default FeatureHighlights