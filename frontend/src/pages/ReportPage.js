import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReportPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState('');
  const [report, setReport] = useState(null);

  // Fetch quizzes for dropdown
  useEffect(() => {
    const fetchQuizzes = async () => {
      const res = await axios.get('http://localhost:5050/api/quizzes');
      setQuizzes(res.data);
    };
    fetchQuizzes();
  }, []);

  const handleGenerateReport = async () => {
    if (!selectedQuizId) return;
    const res = await axios.get(`http://localhost:5050/api/reports/quiz/${selectedQuizId}`);
    setReport(res.data);
  };

  return (
    <div>
      <h2>Quiz Report</h2>
      <select value={selectedQuizId} onChange={(e) => setSelectedQuizId(e.target.value)}>
        <option value="">-- Select Quiz --</option>
        {quizzes.map(q => (
          <option key={q.quiz_id} value={q.quiz_id}>
            {q.title}
          </option>
        ))}
      </select>
      <button onClick={handleGenerateReport}>Generate Report</button>

      {report && (
        <div>
          <h3>Average Score: {report.average.toFixed(2)}</h3>
          <ul>
            {report.studentScores.map((s, idx) => (
              <li key={idx}>
                Student ID: {s.student_id} — Score: {s.score}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ReportPage;
