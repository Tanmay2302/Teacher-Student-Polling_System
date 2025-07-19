// File: src/pages/TeacherHistory.jsx

import { useEffect, useState } from "react";

function TeacherHistory() {
  const [pollHistory, setPollHistory] = useState([]);

  useEffect(() => {
    const fetchPollHistory = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/poll/history`
        );
        if (res.ok) {
          const history = await res.json();

          // Transform backend poll data to the expected frontend format
          const formatted = history.map((poll) => {
            const totalResponses = poll.responses
              ? Object.keys(poll.responses).length
              : 0;
            const results = poll.options.map((opt) => ({
              text: opt.option,
              percentage:
                totalResponses > 0
                  ? Math.round((opt.votes / totalResponses) * 100)
                  : 0,
            }));
            return {
              question: poll.question,
              results,
            };
          });

          setPollHistory(formatted);
        } else {
          console.error("Failed to fetch poll history");
        }
      } catch (error) {
        console.error("Error fetching poll history:", error);
      }
    };

    fetchPollHistory();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center bg-white p-6">
      <h1 className="text-2xl font-semibold mb-6">
        View <span className="font-bold">Poll History</span>
      </h1>
      <div className="w-full max-w-2xl flex flex-col gap-6">
        {pollHistory.map((poll, index) => (
          <div key={index} className="bg-gray-100 rounded-lg p-4 shadow">
            <h2 className="font-medium mb-3">Question {index + 1}</h2>
            <h3 className="text-lg font-semibold mb-4">{poll.question}</h3>
            {poll.results.map((option, idx) => (
              <div key={idx} className="mb-2">
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
        ))}
      </div>
    </div>
  );
}

export default TeacherHistory;
