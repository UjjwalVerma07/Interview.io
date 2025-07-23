// import { useNavigate } from "react-router-dom";
// import { useState } from "react";

// export default function HomePage() {
//   const [role, setRole] = useState(null);
//   const navigate = useNavigate();

//   const handleContinue = () => {
//     if (role === "student") navigate("/studententrypage");
//     else if (role === "teacher") navigate("/teacher");
//   };

//   return (
//     <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
//       {/* Badge */}
//       <span className="badge bg-primary mb-3 px-3 py-2 fs-6 rounded-pill">⭐ Intervue Poll</span>

//       {/* Title */}
//       <h1 className="text-center fw-bold">Welcome to the <span className="text-dark">Live Polling System</span></h1>
//       <p className="text-muted text-center mb-5">
//         Please select the role that best describes you to begin using the live polling system
//       </p>

//       {/* Role Options */}
//       <div className="d-flex gap-4 mb-4">
//         <div
//           onClick={() => setRole("student")}
//           className={`p-4 rounded border shadow-sm text-center role-card ${
//             role === "student" ? "border-primary border-2" : "border-light"
//           }`}
//           style={{ cursor: "pointer", width: "220px" }}
//         >
//           <h5 className="fw-semibold">I’m a Student</h5>
//           <p className="text-muted small mb-0">Lorem Ipsum is simply dummy text of the printing and typesetting industry</p>
//         </div>

//         <div
//           onClick={() => setRole("teacher")}
//           className={`p-4 rounded border shadow-sm text-center role-card ${
//             role === "teacher" ? "border-primary border-2" : "border-light"
//           }`}
//           style={{ cursor: "pointer", width: "220px" }}
//         >
//           <h5 className="fw-semibold">I’m a Teacher</h5>
//           <p className="text-muted small mb-0">Submit answers and view live poll results in real-time.</p>
//         </div>
//       </div>

//       {/* Continue Button */}
//       <button
//         className="btn btn-primary px-5 py-2 rounded-pill"
//         disabled={!role}
//         onClick={handleContinue}
//       >
//         Continue
//       </button>
//     </div>
//   );
// }

// src/pages/HomePage.jsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function HomePage() {
  const [role, setRole] = useState(null);
  const [darkMode, setDarkMode] = useState(false); // ✅ Dark mode state
  const navigate = useNavigate();

  const handleContinue = () => {
    if (role === "student") navigate("/studententrypage");
    else if (role === "teacher") navigate("/teacher");
  };

  const toggleTheme = () => setDarkMode(!darkMode);

  const containerClass = darkMode ? "bg-dark text-light" : "bg-light text-dark";
  const cardClass = (type) =>
    `card p-4 text-center shadow-sm role-card ${
      role === type ? "border-primary border-2 shadow" : ""
    } ${darkMode ? "bg-secondary text-white" : ""}`;

  return (
    <div className={`container-fluid d-flex flex-column align-items-center justify-content-center vh-100 ${containerClass}`}>

      {/* Toggle Theme Button */}
      <button
        onClick={toggleTheme}
        className="btn btn-outline-secondary position-absolute top-0 end-0 m-3"
      >
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      {/* Badge and Heading */}
      <div className="text-center mb-4">
        <span
          className="badge bg-gradient text-white px-3 py-2 fs-6 rounded-pill"
          style={{ backgroundColor: "#0d6efd" }}
        >
          ⭐ Intervue Poll
        </span>
        <h1 className="mt-3 fw-bold display-5">
          Welcome to <span className="text-primary">Live Polling</span>
        </h1>
        <p className="text-muted fs-5">
          Select your role to begin your interactive experience.
        </p>
      </div>

      {/* Role Cards */}
      <div className="d-flex flex-column flex-md-row gap-4 mb-5">
        {/* Student Card */}
        <div
          onClick={() => setRole("student")}
          className={cardClass("student")}
          style={{ width: "260px", cursor: "pointer", transition: "all 0.2s ease-in-out" }}
        >
          <div className="mb-2">
            <span className="fs-3">🎓</span>
          </div>
          <h5 className="fw-semibold">I'm a Student</h5>
          <p className="text-muted small mb-0">
            Join polls, submit answers, and view live results.
          </p>
        </div>

        {/* Teacher Card */}
        <div
          onClick={() => setRole("teacher")}
          className={cardClass("teacher")}
          style={{ width: "260px", cursor: "pointer", transition: "all 0.2s ease-in-out" }}
        >
          <div className="mb-2">
            <span className="fs-3">👩‍🏫</span>
          </div>
          <h5 className="fw-semibold">I'm a Teacher</h5>
          <p className="text-muted small mb-0">
            Create polls and monitor student responses live.
          </p>
        </div>
      </div>

      {/* Continue Button */}
      <button
        className="btn btn-primary px-5 py-2 rounded-pill"
        disabled={!role}
        onClick={handleContinue}
      >
        Continue →
      </button>
    </div>
  );
}
