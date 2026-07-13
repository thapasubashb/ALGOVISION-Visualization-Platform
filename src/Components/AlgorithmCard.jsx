const categoryStyles = {
  Sorting: { badge: 'bg-blue-50 text-blue-600', bar: 'bg-blue-400' },
  Searching: { badge: 'bg-teal-50 text-teal-600', bar: 'bg-teal-400' },
  'Linked List': { badge: 'bg-purple-50 text-purple-600', bar: 'bg-purple-400' },
  'Stack & Queue': { badge: 'bg-amber-50 text-amber-600', bar: 'bg-amber-400' },
  Trees: { badge: 'bg-pink-50 text-pink-600', bar: 'bg-pink-400' },
  Graphs: { badge: 'bg-indigo-50 text-indigo-600', bar: 'bg-indigo-400' },
}

function AlgorithmCard({ name, category, description, difficulty, status }) {
  const style = categoryStyles[category] || { badge: 'bg-slate-100 text-slate-600', bar: 'bg-slate-300' }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer h-full">
      <div className={`h-1.5 ${style.bar}`} />
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${style.badge}`}>
            {category}
          </span>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
            status === "Built" ? "bg-teal-50 text-teal-700" : "bg-slate-100 text-slate-500"
          }`}>
            {status}
          </span>
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-1">{name}</h3>
        <p className="text-xs text-slate-400 mb-2">{difficulty}</p>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
    </div>
  )
}

export default AlgorithmCard