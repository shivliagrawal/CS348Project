import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TeacherDashboard from './pages/TeacherDashboard';
import ReportPage from './pages/ReportPage';
import ManageQuestions from './pages/ManageQuestions';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/teacher" />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/teacher/quiz/:quizId/questions" element={<ManageQuestions />} />
      </Routes>
    </Router>
  );
}

export default App;
