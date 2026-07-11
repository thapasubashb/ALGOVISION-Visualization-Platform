import { useState } from "react";

function ArrayInput({ onSubmit }) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  function handleSubmit() {
    // turn the text "8, 3, 6" into a real list: [8, 3, 6]
    const parts = text
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p !== "");

    if (parts.length === 0) {
      setError("Please enter at least one number");
      return;
    }

    const numbers = parts.map(Number);

    if (numbers.some((n) => isNaN(n))) {
      setError("Please only enter numbers, separated by commas");
      return;
    }

    if (numbers.length > 15) {
      setError("Please enter 15 numbers or fewer, so the bars stay readable");
      return;
    }

    setError("");
    onSubmit(numbers);
  }

  return (
    <div className="mb-6">
      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g. 8, 3, 6, 1, 9, 4"
          className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm"
        />
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm"
        >
          Visualize
        </button>
      </div>
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  );
}

export default ArrayInput;
