import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { categories } from "../data/categories";
import Scene3DBackground from "./Scene3DBackground";
import { buildCategoryScene } from "../three/categoryScene";

function CategoryShowcase() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex flex-col justify-center py-24 px-6 relative overflow-hidden">
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
            >
              <Link
                to={cat.path}
                className="block h-full bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-6 border border-sky-100 hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-slate-900">
                    {cat.name}
                  </h3>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      cat.status === "Building now"
                        ? "bg-teal-50 text-teal-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {cat.status}
                  </span>
                </div>
                <p className="text-sm text-slate-600">{cat.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategoryShowcase;
