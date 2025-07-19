import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const StudentName = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const stored = sessionStorage.getItem("studentName");
    if (stored) {
      setName(stored);
    }
  }, []);

  const handleContinue = () => {
    if (!name.trim()) return;
    sessionStorage.setItem("studentName", name.trim());
    navigate("/student/waiting");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="text-sm mb-4 px-4 py-1 bg-indigo-100 text-indigo-700 rounded-full">
        🎓 Intervue Poll
      </div>

      <h1 className="text-3xl font-semibold text-center">
        Let’s <span className="text-black">Get Started</span>
      </h1>

      <p className="text-gray-500 text-center mt-2 max-w-md">
        If you're a student, you'll be able to{" "}
        <span className="font-medium text-black">submit your answers</span>,
        participate in live polls, and see how your responses compare with your
        classmates
      </p>

      <div className="w-full max-w-sm mt-10 space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Enter your Name
        </label>
        <input
          type="text"
          value={name}
          placeholder="e.g. Rahul Bajaj"
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <button
          onClick={handleContinue}
          className={`w-full mt-4 px-6 py-2 rounded-full text-white text-sm transition ${
            name.trim()
              ? "bg-indigo-600 hover:bg-indigo-700"
              : "bg-gray-300 cursor-not-allowed"
          }`}
          disabled={!name.trim()}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default StudentName;
