function AlgorithmCard({
  name,
  category,
  description,
  difficulty,
  isSelected,
  onSelect,
}) {
  return (
    <div
      onClick={onSelect}
      className={`rounded-xl shadow-md p-5 border transition-all cursor-pointer hover:shadow-lg hover:-translate-y-1 ${
        isSelected
          ? "border-blue-500 bg-blue-50 ring-2 ring-blue-300"
          : "bg-white border-slate-100"
      }`}
    >
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
