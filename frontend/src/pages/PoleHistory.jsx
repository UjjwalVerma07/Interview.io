// src/pages/PollHistory.jsx

import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

//const socket = io("https://interview-io-jthf.onrender.com");
const socket=io("http://localhost:5000");

export default function PollHistory() {
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    socket.emit("get_poll_history");
    socket.on("poll_history_data", (data) => {
      setHistoryData(data.reverse());
    });

    return () => {
      socket.off("poll_history_data");
    };
  }, []);

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">📜 Poll History</h2>

      {historyData.length === 0 ? (
        <div className="text-muted text-center">No past polls found.</div>
      ) : (
        historyData.map((poll, idx) => (
          <div key={idx} className="card mb-4 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">{poll.question}</h5>
              {poll.options.map((opt, i) => {
                const count = poll.results[opt] || 0;
                const percent = poll.totalVotes
                  ? Math.round((count / poll.totalVotes) * 100)
                  : 0;
                return (
                  <div key={i} className="mb-2">
                    <div className="d-flex justify-content-between">
                      <span
                        className={poll.correctOption === i ? "text-success fw-bold" : ""}
                      >
                        {opt}
                      </span>
                      <span>{count} votes ({percent}%)</span>
                    </div>
                    <div className="progress">
                      <div
                        className={`progress-bar ${
                          poll.correctOption === i ? "bg-success" : "bg-primary"
                        }`}
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
              <div className="text-end text-muted small mt-2">
                {new Date(poll.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
