// src/components/PollResult.jsx
import React from "react";

export default function PollResult({ results, pollData }) {
  if (!results || !pollData) return null;

  const totalVotes = Object.values(results).reduce((sum, c) => sum + c, 0);

  return (
    <div>
      <h5 className="mb-3">{pollData.question}</h5>
      {pollData.options.map((opt, idx) => {
        const count = results[opt] || 0;
        const percentage = totalVotes ? Math.round((count / totalVotes) * 100) : 0;
        const isCorrect = idx === pollData.correctOption;

        return (
          <div key={idx} className="mb-2">
            <div className="d-flex justify-content-between">
              <span className={isCorrect ? "text-success fw-bold" : ""}>{opt}</span>
              <span>{count} votes ({percentage}%)</span>
            </div>
            <div className="progress">
              <div
                className={`progress-bar ${isCorrect ? "bg-success" : "bg-primary"}`}
                role="progressbar"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
