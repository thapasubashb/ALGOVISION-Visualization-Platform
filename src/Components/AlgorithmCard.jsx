function AlgorithmCard({ name, category, description, difficulty }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer h-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
          {category}
        </span>
        <span className="text-xs text-slate-400">{difficulty}</span>
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">{name}</h3>
      <p className="text-sm text-slate-500">{description}</p>
    </div>
  );
}

export default AlgorithmCard;
