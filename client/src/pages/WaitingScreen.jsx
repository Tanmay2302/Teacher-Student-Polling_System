// src/pages/WaitingScreen.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URL);

const WaitingScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const studentName = sessionStorage.getItem("studentName");
    if (studentName) {
      socket.emit("register_student", studentName);
    }

    const checkActivePoll = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/poll/active`
        );
        if (res.ok) {
          navigate("/student/question");
        }
      } catch (error) {
        console.error("Error checking active poll:", error);
      }
    };

    checkActivePoll();

    socket.on("newPoll", () => {
      navigate("/student/question");
    });

    return () => {
      socket.off("newPoll");
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white px-4">
      {/* Header Tag */}
      <div className="text-sm bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full mb-8">
        🎓 Intervue Poll
      </div>

      {/* Loader */}
      <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-6" />

      {/* Message */}
      <h2 className="text-lg font-medium text-center text-gray-800">
        Wait for the teacher to ask questions..
      </h2>

      {/* Chat icon placeholder (bottom-right) */}
      {/* <div className="absolute bottom-6 right-6 bg-indigo-500 text-white p-3 rounded-full shadow-md cursor-pointer">
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
      </div> */}
    </div>
  );
};

export default WaitingScreen;
