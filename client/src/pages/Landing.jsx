// src/pages/Landing.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (role === "student") navigate("/student/name");
    else if (role === "teacher") navigate("/teacher/create");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white px-4">
      <div className="text-sm mb-4 px-4 py-1 bg-indigo-100 text-indigo-700 rounded-full">
        🎓 Intervue Poll
      </div>

      <h1 className="text-2xl md:text-3xl font-bold text-center">
        Welcome to the <span className="text-black">Live Polling System</span>
      </h1>
      <p className="text-gray-500 mt-2 text-center">
        Please select the role that best describes you to begin using the live
        polling system
      </p>

      <div className="flex flex-col md:flex-row gap-4 mt-8">
        <button
          onClick={() => setRole("student")}
          className={`w-64 border rounded-lg px-6 py-4 text-left transition ${
            role === "student"
              ? "border-indigo-500 bg-indigo-50"
              : "border-gray-200"
          }`}
        >
          <h2 className="font-semibold">I’m a Student</h2>
          <p className="text-sm text-gray-600 mt-1">
            Join the poll, submit your response, and see live results in
            real-time.
          </p>
        </button>

        <button
          onClick={() => setRole("teacher")}
          className={`w-64 border rounded-lg px-6 py-4 text-left transition ${
            role === "teacher"
              ? "border-indigo-500 bg-indigo-50"
              : "border-gray-200"
          }`}
        >
          <h2 className="font-semibold">I’m a Teacher</h2>
          <p className="text-sm text-gray-600 mt-1">
            Submit questions and view poll results live as students respond.
          </p>
        </button>
      </div>

      <button
        onClick={handleContinue}
        disabled={!role}
        className={`mt-8 px-8 py-2 rounded-full text-white transition ${
          role
            ? "bg-indigo-600 hover:bg-indigo-700"
            : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        Continue
      </button>
    </div>
  );
};

export default Landing;
