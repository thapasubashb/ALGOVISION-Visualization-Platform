import { useState, useEffect } from "react";
import { bubbleSortTrace } from "../../algorithms/bubbleSort";
import ArrayInput from "../ArrayInput";

const SPEED_OPTIONS = [0.5, 1, 1.5, 2]; // NEW: the four speeds we support

function BubbleSortVisualizer() {
  const [steps, setSteps] = useState(() => bubbleSortTrace([8, 3, 6, 1, 9, 4]));
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1); // NEW: memory box for current speed, 1x by default

  function handleNewArray(newArray) {
    setSteps(bubbleSortTrace(newArray));
    setCurrentStep(0);
    setIsPlaying(false);
  }

  useEffect(() => {
    if (!isPlaying) return;
    if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }
    const delay = 500 / speed; // NEW: wait time now depends on speed
    const timer = setTimeout(() => {
      setCurrentStep((s) => s + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, steps, speed]); // NEW: speed added here — important, explained below

  const step = steps[currentStep];

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-8">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Bubble Sort</h3>

      <ArrayInput onSubmit={handleNewArray} />

      <div className="flex items-end gap-2 h-64 mb-6">
        {step.array.map((value, index) => {
          let barColor = "bg-slate-300";
          if (step.sortedIndices.includes(index)) barColor = "bg-green-400";
          else if (step.swapped.includes(index)) barColor = "bg-red-400";
          else if (step.comparing.includes(index)) barColor = "bg-amber-400";

          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div
                className={`w-full rounded-t-md transition-all duration-300 ${barColor}`}
                style={{ height: `${value * 20}px` }}
              />
              <span className="text-xs text-slate-500 mt-1">{value}</span>
            </div>
          );
        })}
      </div>

      <p className="text-sm text-slate-600 mb-4">{step.description}</p>

      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
          disabled={currentStep === 0}
          className="px-3 py-2 bg-slate-200 rounded-lg disabled:opacity-40"
        >
          Back
        </button>
        <button
          onClick={() => setIsPlaying((p) => !p)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button
          onClick={() =>
            setCurrentStep((s) => Math.min(steps.length - 1, s + 1))
          }
          disabled={currentStep === steps.length - 1}
          className="px-3 py-2 bg-slate-200 rounded-lg disabled:opacity-40"
        >
          Next
        </button>
        <button
          onClick={() => {
            setCurrentStep(0);
            setIsPlaying(false);
          }}
          className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg"
        >
          Reset
        </button>

        {/* NEW: speed selector — same highlight pattern as your algorithm cards */}
        <div className="flex items-center gap-1 ml-2">
          <span className="text-xs text-slate-400 mr-1">Speed:</span>
          {SPEED_OPTIONS.map((option) => (
            <button
              key={option}
              onClick={() => setSpeed(option)}
              className={`px-2 py-1 text-xs rounded-md ${
                speed === option
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {option}x
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-400 ml-auto">
          Step {currentStep + 1} / {steps.length}
        </span>
      </div>
    </div>
  );
}

export default BubbleSortVisualizer;
