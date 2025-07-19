// src/pages/StudentQuestion.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URL);

const StudentQuestion = () => {
  const [poll, setPoll] = useState(null);
  const [selected, setSelected] = useState("");
  const [seconds, setSeconds] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActivePoll = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/poll/active`
        );
        if (res.ok) {
          const data = await res.json();
          setPoll(data);
          setSeconds(data.duration);
        } else {
          navigate("/student/waiting");
        }
      } catch (error) {
        console.error("Error fetching active poll:", error);
        navigate("/student/waiting");
      }
    };

    fetchActivePoll();

    socket.on("pollEnded", () => {
      navigate("/student/results");
    });

    return () => {
      socket.off("pollEnded");
    };
  }, [navigate]);

  useEffect(() => {
    if (!seconds) return;

    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit(); // Auto-submit on timeout
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds]);

  const handleSubmit = () => {
    if (selected) {
      socket.emit("submit_answer", selected);
    }
    navigate("/student/results");
  };

  if (!poll) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p>Loading question...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 flex items-center justify-center relative">
      {/* Header */}
      <div className="absolute top-6 text-sm bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full">
        🎓 Intervue Poll
      </div>

      {/* Question Box */}
      <div className="w-full max-w-xl border border-gray-300 rounded-lg p-6 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-700">Question</h3>
          <div className="flex items-center gap-1 text-red-500 font-medium text-sm">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6l4 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            00:{seconds.toString().padStart(2, "0")}
          </div>
        </div>

        <p className="mb-4 font-medium text-gray-800 border-b pb-3">
          {poll.question}
        </p>

        {/* Options */}
        <div className="space-y-3">
          {poll.options.map((opt) => (
            <label
              key={opt.option}
              className={`flex items-center px-4 py-2 border rounded-md cursor-pointer transition ${
                selected === opt.option
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-200"
              }`}
            >
              <input
                type="radio"
                name="option"
                value={opt.option}
                checked={selected === opt.option}
                onChange={() => setSelected(opt.option)}
                className="mr-3"
              />
              <span className="text-gray-800">{opt.option}</span>
            </label>
          ))}
        </div>

        {/* Submit */}
        <button
          className={`mt-6 w-full py-2 rounded-full text-white transition text-sm ${
            selected
              ? "bg-indigo-600 hover:bg-indigo-700"
              : "bg-gray-300 cursor-not-allowed"
          }`}
          onClick={handleSubmit}
          disabled={!selected}
        >
          Submit
        </button>
      </div>

      {/* Chat icon bottom-right */}
      <div className="absolute bottom-6 right-6 bg-indigo-500 text-white p-3 rounded-full shadow-md cursor-pointer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.88L3 21l1.88-4A8.963 8.963 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </div>
    </div>
  );
};

export default StudentQuestion;
