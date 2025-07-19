// File: src/pages/StudentResult.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URL);

function StudentResult() {
  const [question, setQuestion] = useState("");
  const [results, setResults] = useState([]);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handlePollResults = ({
      question,
      results,
      answeredCount,
      totalStudents,
    }) => {
      setQuestion(question);
      setResults(results);
      setAnsweredCount(answeredCount);
      setTotalStudents(totalStudents);
    };

    const handleNewPoll = () => {
      navigate("/student/question");
    };

    socket.on("pollResults", handlePollResults);
    socket.on("newPoll", handleNewPoll);

    return () => {
      socket.off("pollResults", handlePollResults);
      socket.off("newPoll", handleNewPoll);
    };
  }, [navigate]); // ensure cleanup on unmount

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <h1 className="text-lg font-medium mb-2">
        Question <span className="text-red-500 text-sm">⏱️ Live</span>
      </h1>
      <div className="bg-gray-100 rounded-lg p-6 w-full max-w-lg shadow">
        <h2 className="text-lg font-semibold mb-4">{question}</h2>
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
      <p className="mt-4 text-sm text-gray-600">
        {answeredCount} out of {totalStudents} students answered
      </p>
      <p className="mt-2 text-gray-700 font-medium">
        Wait for the teacher to ask a new question..
      </p>
    </div>
  );
}

export default StudentResult;
