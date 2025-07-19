// File: src/pages/TeacherResults.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URL);

function TeacherResults() {
  const [question, setQuestion] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const handlePollResults = ({ question, results }) => {
      setQuestion(question);
      setResults(results);
    };

    socket.on("pollResults", handlePollResults);

    return () => {
      socket.off("pollResults", handlePollResults);
    };
  }, []);

  const handleAskNew = () => {
    socket.emit("endPoll");
    navigate("/teacher/create");
  };

  const handleViewHistory = () => {
    navigate("/teacher/history");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <h1 className="text-2xl font-semibold mb-6">Question</h1>
      <div className="bg-gray-100 rounded-lg p-6 w-full max-w-lg shadow">
        <h2 className="text-lg font-medium mb-4">{question}</h2>
        {results.map((option, idx) => (
          <div key={idx} className="mb-3">
            <div className="flex justify-between mb-1">
              <span>{option.text}</span>
              <span>{option.percentage}%</span>
            </div>
            <div className="w-full bg-gray-300 rounded-full h-3">
              <div
                className="bg-purple-500 h-3 rounded-full"
                style={{ width: `${option.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <button
          onClick={handleAskNew}
          className="bg-purple-500 text-white px-6 py-2 rounded-full hover:bg-purple-600"
        >
          + Ask a new question
        </button>
        <button
          onClick={handleViewHistory}
          className="bg-gray-800 text-white px-6 py-2 rounded-full hover:bg-gray-900"
        >
          View Poll History
        </button>
      </div>
    </div>
  );
}

export default TeacherResults;
