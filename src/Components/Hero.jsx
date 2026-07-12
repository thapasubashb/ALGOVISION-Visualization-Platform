import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Scene3DBackground from "./Scene3DBackground";
import { buildHeroScene } from "../three/heroScene";

function Hero() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-sky-50 to-white text-slate-900 flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
      <Scene3DBackground buildScene={buildHeroScene} />

      <div className="relative z-10 flex flex-col items-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-blue-600 text-sm font-medium tracking-widest uppercase mb-4"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Learn by watching
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-7xl font-bold max-w-3xl leading-tight text-slate-900"
          style={{ fontFamily: "'Sora', sans-serif" }}
        >
          Algorithms, finally visible.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="text-slate-600 max-w-xl mt-6 text-lg"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Step through DSA, OS, CN, and DBMS concepts one move at a time — with
          an AI tutor watching alongside you.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <Link
            to="/dsa"
            className="inline-block mt-10 px-7 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-full transition-colors shadow-lg shadow-blue-200"
          >
            Start exploring
          </Link>
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 z-10 text-slate-400 text-xs tracking-widest uppercase"
      >
        Scroll
      </motion.div>
    </section>
  );
}

export default Hero;
