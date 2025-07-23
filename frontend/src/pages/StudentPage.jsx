import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import PollResult from "./PoleResults";

// Connect to backend server
const socket = io("https://interview-io-9ppy.onrender.com");
//const socket=io("http://localhost:5000");


export default function StudentPage() {
  const [name] = useState(() => sessionStorage.getItem("studentName"));
  const [poll, setPoll] = useState(null);
  const [selected, setSelected] = useState("");
  const [results, setResults] = useState(null);
  const [timer, setTimer] = useState(60);
  const [chatMessages, setChatMessages] = useState([]);
const [newMessage, setNewMessage] = useState("");
const [activeTab, setActiveTab] = useState("chat");
const [participants, setParticipants] = useState([]);
const [showPanel, setShowPanel] = useState(false);
const [showResults, setShowResults] = useState(false);



  const navigate = useNavigate();

  useEffect(() => {
    // If no name found, redirect to student-entry
    if (!name) {
      navigate("/student-entry");
      return;
    }

    socket.emit("join_student", name);


    socket.on("new_poll", (pollData) => {
      setPoll(pollData);
      setResults(null);
      setSelected("");
      setTimer(pollData.timer || 60);
    });

    socket.on("live_results", (data) => setResults(data));
    // socket.on("poll_complete", () => setTimer(0));
        socket.on("receive_message", (msg) => {
  setChatMessages(prev => [...prev, msg]);
});

// socket.on("update_participants", (data) => {
//   setParticipants(data);
// });

socket.on("participants_list", (data) => {
  console.log(data)
  setParticipants(data);
  console.log(participants)
});

socket.on("kicked", () => {
  alert("You have been removed from the session by the teacher.");
  sessionStorage.removeItem("studentName");
  navigate("/studentkicked"); // Or just use: navigate("/")
});


socket.on("poll_complete", () => {
  setTimer(0);
  setShowResults(true); // 👈 ADD THIS
});


socket.on("chat_message", (msg) => {
  setChatMessages(prev => [...prev, msg]);
});


    return () => {

  socket.off("new_poll");
  socket.off("live_results");
  socket.off("poll_complete");
  socket.off("receive_message");
 // socket.off("update_participants");
  socket.off("chat_message");
  socket.off("participants_list");
  socket.off("kicked"); 

};


  }, [name, navigate]);

  // Timer countdown logic
  useEffect(() => {
    if (poll && timer > 0) {
      const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [poll, timer]);

  const handleSubmit = () => {
    if (selected) {
      socket.emit("submit_answer", { name, answer: selected });
      setTimer(0);
    }
  };

  const handleSendMessage = () => {
  if (newMessage.trim()) {
    const messageObj = { sender: name, text: newMessage.trim() };
socket.emit("chat_message", messageObj);

   // setChatMessages(prev => [...prev, messageObj]);
    setNewMessage("");
  }
};


  return (
    <div className="container mt-5">
      <div className="mb-4 text-center">
        <h2>Welcome, <span className="text-primary">{name}</span></h2>
      </div>

      <div className="card p-4 shadow-sm">
        {poll && timer > 0 ? (
          <>
            <h4 className="mb-3">{poll.question}</h4>
            <div className="form-group">
              {poll.options.map((option, idx) => (
                <div className="form-check mb-2" key={idx}>
                  <input
                    className="form-check-input"
                    type="radio"
                    id={`opt-${idx}`}
                    name="pollOption"
                    value={option}
                    checked={selected === option}
                    onChange={() => setSelected(option)}
                  />
                  <label className="form-check-label" htmlFor={`opt-${idx}`}>
                    {option}
                  </label>
                </div>
              ))}
            </div>
            <button
              className="btn btn-success mt-3"
              disabled={!selected}
              onClick={handleSubmit}
            >
              Submit
            </button>
            <div className="text-muted mt-2">⏳ Time left: {timer}s</div>
          </>
        ) : results ? (
            <>
            {results && showResults && (
  <div className="card p-4 mt-4">
    <h4 className="mb-3">📊 Poll Results</h4>
    <PollResult results={results} pollData={poll} />
    <div className="alert alert-info mt-3 text-center">
      ✅ <strong>{results.correct}</strong> out of <strong>{results.total}</strong> students answered correctly.
    </div>
  </div>
)}

            </>
        ) : (<div className="d-flex flex-column align-items-center justify-content-center" style={{ height: "60vh" }}>
  <span className="badge bg-primary mb-3">⭐ Intervue Poll</span>
  <div className="spinner-border text-primary mb-3" role="status" style={{ width: "3rem", height: "3rem" }}>
    <span className="visually-hidden">Loading...</span>
  </div>
  <h5 className="fw-semibold text-center">Wait for the teacher to ask questions..</h5>
</div>
)}
      </div>


      {/* Floating Chat Button */}
<button
  className="btn btn-primary position-fixed"
  style={{
    bottom: "100px",
    right: "30px",
    zIndex: 1050,
    width: "55px",
    height: "55px",
    borderRadius: "50%",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
  }}
  onClick={() => setShowPanel(prev => !prev)}
>
  💬
</button>

{/* Chat Panel */}
{showPanel && (
  <div
    className="position-fixed shadow d-flex flex-column"
    style={{
      width: "320px",
      height: "400px",
      bottom: "30px",
      right: "30px",
      background: "#fff",
      borderRadius: "12px",
      zIndex: 1000
    }}
  >
    {/* Tabs */}
    <div className="d-flex border-bottom">
      <button
        className={`flex-fill btn ${activeTab === "chat" ? "btn-light fw-bold" : "btn-white"}`}
        onClick={() => setActiveTab("chat")}
      >
        Chat
      </button>
      <button
        className={`flex-fill btn ${activeTab === "participants" ? "btn-light fw-bold" : "btn-white"}`}
        onClick={() => setActiveTab("participants")}
      >
        Participants
      </button>
    </div>

    <div className="flex-grow-1 d-flex flex-column p-2 overflow-hidden">
      {activeTab === "chat" ? (
        <>
          <div className="flex-grow-1 overflow-auto mb-2">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`mb-1 text-${msg.sender === "Teacher" ? "dark" : "primary"}`}>
                <small><strong>{msg.sender}:</strong></small>
                <div className={`p-2 rounded ${msg.sender === "Teacher" ? "bg-dark text-white" : "bg-primary text-white"}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div className="d-flex mt-auto">
            <input
              type="text"
              className="form-control"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button className="btn btn-primary ms-2" onClick={handleSendMessage}>
              Send
            </button>
          </div>
        </>
      ) : (
        <div className="overflow-auto mt-2">
          <ul className="list-group">
            {participants.map((p, idx) => (
              <li className="list-group-item" key={idx}>{p}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  </div>
)}

    </div>
  );
}
