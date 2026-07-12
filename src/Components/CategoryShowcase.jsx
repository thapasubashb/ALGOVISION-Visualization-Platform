import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { categories } from "../data/categories";
import Scene3DBackground from "./Scene3DBackground";
import { buildCategoryScene } from "../three/categoryScene";

function CategoryShowcase() {
  return (
   <section id="explore" className="min-h-screen scroll-mt-20 bg-sky-100 flex flex-col justify-center py-24 px-6 relative overflow-hidden">
      <Scene3DBackground buildScene={buildCategoryScene} cameraZ={13} />

      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto text-center mb-14"
        >
          <h2
            className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            Pick a subject to explore
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto">
            Start with Data Structures & Algorithms — more subjects are on the
            way.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
          {categories.map((cat, i) => (
  <motion.div
    key={cat.id}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.5, delay: i * 0.1 }}
    whileHover={{ y: -8, scale: 1.02 }}
  >
    <Link
      to={cat.path}
      className="block h-full bg-white/25 backdrop-blur-md border border-white/50 shadow-lg shadow-sky-200/40 rounded-2xl p-6 transition-shadow hover:shadow-xl"
    >
      <span className="text-3xl mb-3 block">{cat.icon}</span>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-slate-900">{cat.name}</h3>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
          cat.status === "Building now" ? "bg-teal-500/20 text-teal-800" : "bg-white/40 text-slate-600"
        }`}>
          {cat.status}
        </span>
      </div>
      <p className="text-sm text-slate-700">{cat.description}</p>
    </Link>
  </motion.div>
))}
          
        </div>
      </div>
    </section>
  );
}

export default CategoryShowcase;