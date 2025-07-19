import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import CreatePoll from "./pages/CreatePoll";
import StudentName from "./pages/StudentName";
import WaitingScreen from "./pages/WaitingScreen";
import StudentQuestion from "./pages/StudentQuestion";
import StudentResult from "./pages/StudentResult";
import TeacherResults from "./pages/TeacherResults";
import TeacherHistory from "./pages/TeacherHistory"; // ✅ newly added

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/teacher/create" element={<CreatePoll />} />
      <Route path="/teacher/results" element={<TeacherResults />} />
      <Route path="/teacher/history" element={<TeacherHistory />} />{" "}
      {/* ✅ newly added */}
      <Route path="/student/name" element={<StudentName />} />
      <Route path="/student/waiting" element={<WaitingScreen />} />
      <Route path="/student/question" element={<StudentQuestion />} />
      <Route path="/student/results" element={<StudentResult />} />
    </Routes>
  );
}

export default App;
