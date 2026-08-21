import { Link } from "react-router-dom";
import AlgorithmCard from "../components/AlgorithmCard";
import { algorithms } from "../data/algorithms";



function DSAPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-200 to-white px-6 pt-32 pb-16">
      <div className="max-w-5xl mx-auto">
                <h2 className="text-xl font-semibold text-slate-700 mb-6">
          Choose an algorithm to visualize
        </h2>

        <Link
          to="/dsa/compare"
          className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-gradient-to-r from-blue-700 via-blue-500 to-sky-400 text-white text-sm font-semibold shadow-sm shadow-blue-300/40"
        >
          ⚡ Compare two algorithms side by side
        </Link>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {algorithms.map((algo) => (
            <Link key={algo.id} to={`/dsa/${algo.id}`}>
              <AlgorithmCard {...algo} />
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

export default DSAPage;
