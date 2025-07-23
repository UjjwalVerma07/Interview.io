import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StudentPage from "./pages/StudentPage";
import TeacherPage from "./pages/TeacherPage";
import HomePage from "./pages/HomePage";
import PollHistory from "./pages/PoleHistory";
import StudentEntryPage from "./pages/StudentEntryPage";
import StudentKicked from "./pages/StudentKicked";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/studententrypage" element={<StudentEntryPage/>}/>
        <Route path="/studentkicked" element={<StudentKicked/>}/>
        <Route path="/student" element={<StudentPage/>}/>
        <Route path="/teacher" element={<TeacherPage />} />
       <Route path="/pollhistory" element={<PollHistory/>}/>
      </Routes>
    </Router>
  );
}

export default App;
