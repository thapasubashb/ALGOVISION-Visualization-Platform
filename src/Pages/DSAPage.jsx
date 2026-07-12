import { Link } from "react-router-dom";
import AlgorithmCard from "../components/AlgorithmCard";
import { algorithms } from "../data/algorithms";

function DSAPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <h2 className="text-xl font-semibold text-slate-700 mb-6">
        Choose an algorithm to visualize
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {algorithms.map((algo) => (
          <Link key={algo.id} to={`/dsa/${algo.id}`}>
            <AlgorithmCard {...algo} />
          </Link>
        ))}
      </div>
    </main>
  );
}

export default DSAPage;
