import { motion } from 'framer-motion'

/**
 * Small grid of live numbers (waiting time, packets sent, fault count...).
 * `metrics` is an array of { label, value, accent? } — accent is an
 * optional tailwind text color class for emphasis.
 */
export function MetricPanel({ metrics }) {
  if (!metrics || metrics.length === 0) return null

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {metrics.map((m) => (
        <div key={m.label} className="bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 rounded-lg px-3 py-2 shadow-sm">
          <p className="text-[11px] uppercase tracking-wide text-slate-400 dark:text-slate-500 font-semibold">{m.label}</p>
          <motion.p
            key={String(m.value)}
            initial={{ opacity: 0.3, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`text-lg font-bold ${m.accent || 'text-slate-800 dark:text-slate-100'}`}
          >
            {m.value}
          </motion.p>
        </div>
      ))}
    </div>
  )
}

/** Color-key legend explaining what each highlight color means in the canvas. */
export function Legend({ items }) {
  if (!items || items.length === 0) return null

  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1.5">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
          <span className="text-xs text-slate-500 dark:text-slate-400">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

/** Small pill used for phase/state labels (e.g. "ESTABLISHED", "Page Fault"). */
export function StatusBadge({ children, tone = 'default' }) {
  const tones = {
    default: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300',
    success: 'bg-teal-50 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300',
    warning: 'bg-amber-50 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
    danger: 'bg-rose-50 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300',
    info: 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
  }
  return (
    <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${tones[tone] || tones.default}`}>
      {children}
    </span>
  )
}
