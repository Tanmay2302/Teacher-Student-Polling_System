// src/pages/CreatePoll.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreatePoll = () => {
  const [question, setQuestion] = useState("");
  const [duration, setDuration] = useState(60);
  const [options, setOptions] = useState([
    { text: "", isCorrect: null },
    { text: "", isCorrect: null },
  ]);
  const navigate = useNavigate();

  const handleOptionChange = (index, field, value) => {
    const updated = [...options];
    updated[index][field] = value;
    setOptions(updated);
  };

  const addOption = () => {
    setOptions([...options, { text: "", isCorrect: null }]);
  };

  const handleAskQuestion = async () => {
    if (!question.trim()) {
      alert("Please enter a question.");
      return;
    }

    const optionTexts = options
      .map((opt) => opt.text.trim())
      .filter((opt) => opt !== "");
    if (optionTexts.length < 2) {
      alert("Please provide at least two options.");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/poll/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question,
            options: optionTexts,
            duration,
          }),
        }
      );

      if (response.ok) {
        navigate("/teacher/results");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to create poll.");
      }
    } catch (error) {
      console.error("Error creating poll:", error);
      alert("Error creating poll.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-6 py-12">
      {/* Header Tag */}
      <div className="text-sm bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full mb-6">
        🎓 Intervue Poll
      </div>

      {/* Heading */}
      <h1 className="text-3xl font-semibold text-center">
        Let’s <span className="text-black">Get Started</span>
      </h1>
      <p className="text-gray-500 text-center mt-2 max-w-xl">
        you’ll have the ability to create and manage polls, ask questions, and
        monitor your students’ responses in real-time.
      </p>

      <div className="w-full max-w-2xl mt-10">
        {/* Question Input */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">
              Enter your question
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
            >
              <option value={30}>30 seconds</option>
              <option value={60}>60 seconds</option>
              <option value={90}>90 seconds</option>
            </select>
          </div>

          <textarea
            rows="3"
            maxLength={100}
            placeholder="Type your question here..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full p-4 border rounded-md bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="text-right text-xs text-gray-400 mt-1">
            {question.length}/100
          </div>
        </div>

        {/* Options */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-3">Edit Options</p>

          {options.map((option, index) => (
            <div key={index} className="flex items-center gap-4 mb-4">
              <input
                type="text"
                placeholder={`Option ${index + 1}`}
                value={option.text}
                onChange={(e) =>
                  handleOptionChange(index, "text", e.target.value)
                }
                className="flex-1 p-2 border rounded-md bg-gray-100 text-sm"
              />
              <div className="flex items-center gap-3 text-sm">
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name={`correct-${index}`}
                    checked={option.isCorrect === true}
                    onChange={() =>
                      handleOptionChange(index, "isCorrect", true)
                    }
                  />
                  Yes
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name={`correct-${index}`}
                    checked={option.isCorrect === false}
                    onChange={() =>
                      handleOptionChange(index, "isCorrect", false)
                    }
                  />
                  No
                </label>
              </div>
            </div>
          ))}

          <button
            onClick={addOption}
            className="text-sm text-indigo-600 mt-1 hover:underline"
          >
            + Add More option
          </button>
        </div>

        {/* Ask Question Button */}
        <div className="text-right">
          <button
            onClick={handleAskQuestion}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full text-sm"
          >
            Ask Question
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePoll;
