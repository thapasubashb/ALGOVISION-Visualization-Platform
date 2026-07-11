import { useState } from "react";
import Navbar from "./components/Navbar";
import AlgorithmCard from "./components/AlgorithmCard";
import { algorithms } from "./data/algorithms";
import BubbleSortVisualizer from "./components/visualizers/BubbleSortVisualizer";
import SelectionSortVisualizer from "./components/visualizers/SelectionSortVisualizer";
function App() {
  // this is our memory box — starts empty (nothing selected)
  const [selectedId, setSelectedId] = useState(null);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="text-xl font-semibold text-slate-700 mb-6">
          Choose an algorithm to visualize
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {algorithms.map((algo) => (
            <AlgorithmCard
              key={algo.id}
              {...algo}
              isSelected={selectedId === algo.id}
              onSelect={() => setSelectedId(algo.id)}
            />
          ))}
        </div>

        {selectedId && (
          <p className="mt-8 text-slate-600">
            You selected:{" "}
            <span className="font-semibold text-blue-600">{selectedId}</span>
          </p>
        )}

        {/* NEW LINE — add this right here */}
        {selectedId === "bubble-sort" && <BubbleSortVisualizer />}
        {selectedId === "selection-sort" && <SelectionSortVisualizer />}
      </main>
    </div>
  );
}

export default App;
