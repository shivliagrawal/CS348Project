import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TeacherDashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', teacher_id: 1 });

  const fetchQuizzes = async () => {
    const res = await axios.get('http://localhost:5050/api/quizzes');
    setQuizzes(res.data);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5050/api/quizzes', form);
    setForm({ title: '', description: '', teacher_id: 1 });
    fetchQuizzes();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5050/api/quizzes/${id}`);
    fetchQuizzes();
  };

  useEffect(() => { fetchQuizzes(); }, []);

  return (
    <div>
      <h2>Create Quiz</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Quiz Title" value={form.title} onChange={handleChange} required />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <button type="submit">Add Quiz</button>
      </form>

      <h3>All Quizzes</h3>
      <ul>
        {quizzes.map(q => (
          <li key={q.quiz_id}>
            <strong>{q.title}</strong>: {q.description}
            <button onClick={() => handleDelete(q.quiz_id)}>Delete</button>
            <button onClick={() => window.location.href = `/teacher/quiz/${q.quiz_id}/questions`}>
            Manage Questions
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeacherDashboard;
