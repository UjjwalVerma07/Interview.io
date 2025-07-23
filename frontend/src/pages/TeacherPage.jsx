// src/pages/TeacherPage.jsx
import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import PollResults from "./PoleResults";
import { useNavigate } from "react-router-dom";

const socket = io("https://interview-io-9ppy.onrender.com");
//const socket = io("http://localhost:5000");
export default function TeacherPage() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ]);
  const [duration, setDuration] = useState(60);
  const [canCreatePoll, setCanCreatePoll] = useState(true);
  const [chatMessages, setChatMessages] = useState([]);
const [newMessage, setNewMessage] = useState("");
const [participants, setParticipants] = useState([]);
const [showPanel, setShowPanel] = useState(false); // Chat panel toggle
const [activeTab, setActiveTab] = useState("chat"); // "chat" or "participants"
const [showResults, setShowResults] = useState(false);
const [pollData, setPollData] = useState(null); // store current poll
const [results, setResults] = useState(null);
const navigate=useNavigate();


useEffect(() => {
 // Teacher joins — send current participants list
socket.on('join_teacher', () => {
  socket.emit('participants_list', participants);
});
  // New poll started
  socket.on("new_poll", (data) => {
    setCanCreatePoll(false);
    setResults(null);
    setShowResults(false);
    setPollData(data);
  });

  // Poll completed
  socket.on("poll_complete", () => {
    setCanCreatePoll(true);  // Allow new poll
    setShowResults(false);   // Hide results until teacher clicks
  });

  // Live results (stored, hidden by default)
  socket.on("live_results", (data) => {
    console.log("Received result",data)
    setResults(data);
  });

  // Chat messages
  socket.on("chat_message", (msg) => {
    setChatMessages(prev => [...prev, msg]);
  });

  // Participants list
  socket.on("participants_list", (list) => {
    console.log("Received participants list:", list);
    setParticipants(list);
  });

  // Cleanup on component unmount
  return () => {

    socket.off("new_poll");
    socket.off("poll_complete");
    socket.off("live_results");
    socket.off("chat_message");
    socket.off("participants_list");
  };
},);


  const handleOptionTextChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index].text = value;
    setOptions(newOptions);
  };

  
  const handleSendMessage = () => {
if (newMessage.trim()) {
    const msg = { sender: "Teacher", text: newMessage };
    socket.emit("chat_message", msg);
    //setChatMessages(prev => [...prev, msg]);
    setNewMessage("");
  }
};


  const handleCorrectChange = (index) => {
    const newOptions = options.map((opt, i) => ({
      ...opt,
      isCorrect: i === index,
    }));
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, { text: "", isCorrect: false }]);
  };

  const handleCreatePoll = () => {
    if (!question.trim()) return;
    const validOptions = options.filter((opt) => opt.text.trim());
    if (validOptions.length < 2) return;

    const correct = validOptions.find((opt) => opt.isCorrect);
    if (!correct) return alert("Please mark a correct answer.");

    socket.emit("create_poll", {
      question: question.trim(),
      options: validOptions.map((opt) => opt.text.trim()),
      correctOption: validOptions.findIndex((opt) => opt.isCorrect),
      duration,
    });

    setQuestion("");
    setOptions([
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ]);
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-4">

        <span className="badge bg-primary mb-2">⚡ Intervue Poll</span>
        <h2>Let’s <strong>Get Started</strong></h2>
        <p className="text-muted">
          you’ll have the ability to create and manage polls, ask questions, and
          monitor your students' responses in real-time.
        </p>
      </div>

      <div className="text-end mb-3">
  <button className="btn btn-outline-secondary" onClick={() => navigate("/pollhistory")}>
    📜 View Poll History
  </button>
</div>


      <div className="card p-4">
        <div className="mb-3 d-flex justify-content-between align-items-center">
          <label className="form-label fw-semibold">Enter your question</label>
          <select
            className="form-select w-auto"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            disabled={!canCreatePoll}
          >
            {[30, 45, 60, 90].map((sec) => (
              <option key={sec} value={sec}>
                {sec} seconds
              </option>
            ))}
          </select>
        </div>

        <textarea
          className="form-control mb-3"
          rows="2"
          maxLength={100}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Type your question here..."
          disabled={!canCreatePoll}
        />

        <div>
          <label className="form-label">Edit Options</label>
          {options.map((opt, index) => (
            <div className="row mb-2 align-items-center" key={index}>
              <div className="col-1 fw-bold">{index + 1}</div>
              <div className="col-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder={`Option ${index + 1}`}
                  value={opt.text}
                  onChange={(e) => handleOptionTextChange(index, e.target.value)}
                  disabled={!canCreatePoll}
                />
              </div>
              <div className="col-5 d-flex align-items-center">
                <div className="form-check me-3">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="correctOption"
                    checked={opt.isCorrect}
                    onChange={() => handleCorrectChange(index)}
                    disabled={!canCreatePoll}
                  />
                  <label className="form-check-label">Yes</label>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    name={`incorrect-${index}`}
                    checked={!opt.isCorrect}
                    onChange={() => handleCorrectChange(index)}
                    disabled={!canCreatePoll}
                  />
                  <label className="form-check-label">No</label>
                </div>
              </div>
            </div>
          ))}
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={addOption}
            disabled={!canCreatePoll}
          >
            + Add More option
          </button>
        </div>

        <div className="text-end mt-4">
          <button
            className="btn btn-primary px-4"
            onClick={handleCreatePoll}
            disabled={!canCreatePoll}
          >
            Ask Question
          </button>
        </div>
      </div>


      


      {/* Chat and Participants Panel */}
{/* Floating Chat Button */}
<button
  className="btn btn-primary position-fixed"
  style={{
    bottom: "100px", // moved up so it doesn’t overlap the input
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

{/* Chat + Participants Panel */}
{showPanel && (
  <div
    className="position-fixed bottom-0 end-0 m-4 shadow d-flex flex-column"
    style={{ width: "320px", height: "380px", background: "#fff", borderRadius: "10px", zIndex: 1000 }}
  >
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

    {activeTab === "chat" ? (
      <div className="p-2 d-flex flex-column h-100">
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
        <div className="d-flex">
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
      </div>
    ) : (
      <div className="p-3 overflow-auto">
        <ul className="list-group">
          {participants.map((p, idx) => (
            <li className="list-group-item" key={idx}>
              {p}
               <button
      className="btn btn-sm btn-danger"
      onClick={() => socket.emit("kick_participant", p)}
    >
      ❌ Kick
    </button>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
)}



{results && !showResults && (
  <div className="text-center mt-4">
    <button
      className="btn btn-outline-primary"
      onClick={() => setShowResults(true)}
    >
      👁️ Show Results
    </button>
  </div>
)}

{!results && !canCreatePoll && (
  <div className="text-center mt-4">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Waiting for responses...</span>
    </div>
    <p className="text-muted mt-2">Waiting for students to respond...</p>
  </div>
)}


{results && showResults && (
  <div className="card p-4 mt-4">
    <h4 className="mb-3">📊 Poll Results</h4>
    <PollResults results={results} pollData={pollData} />
  </div>
)}


    </div>
  );
}
