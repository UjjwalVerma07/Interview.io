import React from "react";

const StudentKicked = () => {
  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-white text-center px-3">
      <div>
        <button className="btn btn-primary mb-4 px-4 py-2 rounded-pill fw-medium">
          ✦ Intervue Poll
        </button>
        <h1 className="fw-semibold mb-2">You’ve been Kicked out !</h1>
        <p className="text-muted">
          Looks like the teacher had removed you from the poll system. Please try again sometime.
        </p>
      </div>
    </div>
  );
};

export default StudentKicked;
