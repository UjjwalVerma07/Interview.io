import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StudentEntryPage() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleContinue = () => {
    if (name.trim()) {
      sessionStorage.setItem("studentName", name.trim());
      navigate("/student");
    }
  };

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
      {/* Badge */}
      <span className="badge bg-primary mb-3 px-3 py-2 fs-6 rounded-pill">⭐ Intervue Poll</span>

      {/* Heading */}
      <h2 className="fw-semibold text-center mb-2">
        Let’s <span className="fw-bold">Get Started</span>
      </h2>

      <p className="text-muted text-center mb-5" style={{ maxWidth: "500px" }}>
        If you’re a student, you’ll be able to <strong>submit your answers</strong>,
        participate in live polls, and see how your responses compare with your classmates.
      </p>

      {/* Input Field */}
      <div className="w-100 mb-4" style={{ maxWidth: "400px" }}>
        <label className="form-label">Enter your Name</label>
        <input
          type="text"
          className="form-control bg-light border-0 shadow-sm"
          placeholder="e.g., Rahul Bajaj"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Continue Button */}
      <button
        className="btn btn-primary px-5 py-2 rounded-pill"
        disabled={!name.trim()}
        onClick={handleContinue}
      >
        Continue
      </button>
    </div>
  );
}
