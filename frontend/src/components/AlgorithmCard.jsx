const categoryStyles = {
  Sorting: { badge: 'bg-blue-50 text-blue-600', bar: 'bg-blue-400' },
  Searching: { badge: 'bg-teal-50 text-teal-600', bar: 'bg-teal-400' },
  'Linked List': { badge: 'bg-purple-50 text-purple-600', bar: 'bg-purple-400' },
  'Stack & Queue': { badge: 'bg-amber-50 text-amber-600', bar: 'bg-amber-400' },
  Trees: { badge: 'bg-pink-50 text-pink-600', bar: 'bg-pink-400' },
  Graphs: { badge: 'bg-indigo-50 text-indigo-600', bar: 'bg-indigo-400' },
  DBMS: { badge: 'bg-cyan-50 text-cyan-700', bar: 'bg-cyan-400' },
  Networking: { badge: 'bg-emerald-50 text-emerald-700', bar: 'bg-emerald-400' },
  'Operating Systems': { badge: 'bg-orange-50 text-orange-700', bar: 'bg-orange-400' },
}

function AlgorithmCard({ name, category, description, difficulty, status }) {
  const style = categoryStyles[category] || { badge: 'bg-slate-100 text-slate-600', bar: 'bg-slate-300' }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md dark:shadow-black/30 overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer h-full">
      <div className={`h-1.5 ${style.bar}`} />
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${style.badge} dark:brightness-125 dark:bg-opacity-20`}>
            {category}
          </span>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
            status === "Built" ? "bg-teal-50 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
          }`}>
            {status}
          </span>
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">{name}</h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-2">{difficulty}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
      </div>
    </div>
  )
}

export default AlgorithmCard