import { motion } from "framer-motion";

const features = [
  {
    number: "01",
    title: "Step through it, your way",
    description:
      "Play, pause, step forward or back, and control the speed from 0.5x to 2x. No rushed videos, no lost pace.",
  },
  {
    number: "02",
    title: "Use your own data",
    description:
      "Type in your own numbers and watch the exact same algorithm run on them, not just a fixed demo.",
  },
  {
    number: "03",
    title: "Ask, right when you're confused",
    description:
      "An AI tutor sits alongside every visualizer, aware of exactly what step you're looking at.",
  },
];

function FeatureHighlights() {
  return (
    <section className="bg-white py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-bold text-slate-800 text-center mb-16"
          style={{ fontFamily: "'Sora', sans-serif" }}
        >
          Built to actually make it click
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((f, i) => (
            <motion.div
              key={f.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
            >
              <span
                className="text-blue-500 text-sm font-semibold"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {f.number}
              </span>
              <h3
                className="text-xl font-bold text-slate-800 mt-2 mb-3"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                {f.title}
              </h3>
              <p
                className="text-slate-500 text-sm leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {f.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeatureHighlights;
