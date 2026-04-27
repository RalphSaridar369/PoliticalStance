import { useState } from "react";
import "./App.css";
import api from "./api";

function App() {
  const [split, setSplit] = useState(50);
  const [inputText, setInputText] = useState<string>("");
  const [data, setData] = useState<{ score: string; label: string } | null>(null);

  const animateSplit = (from: number, to: number, duration = 600) => {
    const start = performance.now();

    const step = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      const value = from + (to - from) * progress;

      setSplit(Math.round(value));

      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  const fetchScore = async () => {
    if (!inputText.trim()) return;

    try {
      const response = await api.post("/predict", { text: inputText });
      const data = response.data;

      setData({
        label: data.label,
        score: (Math.max(...data.scores) * 100).toFixed(2),
      });

      const conservative = data.scores[1];
      const newSplit = Math.round(conservative * 100);

      animateSplit(split, newSplit);
    } catch (err) {
      console.error("API error:", err);
    }
  };

  return (
    <div className="container">
      {/* SPLIT BAR */}
      <div className="split-bar">
        {data?.label && (
          <div className="score-label">
            <h1>
              {data.score}% {data.label}
            </h1>
          </div>
        )}

        <div className="blue" style={{ width: `${100 - split}%` }} />
        <div className="red" style={{ width: `${split}%` }} />
      </div>

      <div className="input-container">
        <div className="info-wrapper">
          <div>
            Insert a statement to check its political bias.
          </div>
        </div>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              fetchScore();
            }
          }}
          placeholder="Enter statement..."
        />

        <button onClick={fetchScore}>Analyze</button>
      </div>
    </div>
  );
}

export default App;