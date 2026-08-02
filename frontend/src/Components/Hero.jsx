import { motion } from 'framer-motion'
import Scene3DBackground from './Scene3DBackground'
import { buildHeroScene } from '../three/heroScene'

function Hero() {
  return (
    <section className="min-h-screen bg-sky-100 text-slate-900 flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
      <Scene3DBackground buildScene={buildHeroScene} />

      <div className="relative z-10 flex flex-col items-center pb-8 sm:pb-14 mt-24">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-sm font-semibold tracking-widest uppercase mb-4 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent"
        >
          Learn by watching
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-7xl font-bold max-w-3xl leading-tight bg-gradient-to-br from-blue-950 via-blue-700 to-cyan-500 bg-clip-text text-transparent"
          style={{ fontFamily: "'Sora', sans-serif" }}
        >
          Algorithms, finally visible.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="max-w-xl mt-6 text-lg text-slate-600"
        >
          Step through DSA, OS, CN, and DBMS concepts one move at a time — with an AI tutor watching alongside you.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <a
            href="#explore"
            className="inline-block mt-10 px-10 py-4 text-lg bg-gradient-to-b from-white/40 to-white/10 backdrop-blur-xl border border-white/50 text-blue-800 font-semibold rounded-full shadow-[0_8px_32px_0_rgba(14,165,233,0.2)] hover:from-white/60 hover:to-white/20 hover:shadow-[0_8px_32px_0_rgba(14,165,233,0.35)] hover:scale-105 active:scale-95 transition-all"
          >
            Start exploring
          </a>
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 z-10 text-slate-500 text-xs tracking-widest uppercase"
      >
        Scroll
      </motion.div>
    </section>
  )
}

export default Hero