import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';

const ManageQuestions = () => {
  const { quizId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState({ question_text: '', correct_option: '' });

  const fetchQuestions = async () => {
    try {
      const res = await API.get(`/api/questions/${quizId}`);
      setQuestions(res.data);
    } catch (err) {
      console.error('Fetch error:', err.message);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const addQuestion = async () => {
    try {
      await API.post('/api/questions', {
        quiz_id: quizId,
        question_text: form.question_text,
        correct_option: form.correct_option,
      });
      setForm({ question_text: '', correct_option: '' });
      fetchQuestions();
    } catch (err) {
      console.error('Add error:', err.message);
    }
  };

  const deleteQuestion = async (id) => {
    await API.delete(`/api/questions/${id}`);
    fetchQuestions();
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <div>
      <h2>Manage Questions for Quiz {quizId}</h2>
      <input
        name="question_text"
        placeholder="Enter new question"
        value={form.question_text}
        onChange={handleChange}
      />
      <input
        name="correct_option"
        placeholder="Correct answer"
        value={form.correct_option}
        onChange={handleChange}
      />
      <button onClick={addQuestion}>Add Question</button>

      <ul>
        {questions.map((q) => (
          <li key={q.question_id}>
            {q.question_text} — <i>Answer: {q.correct_option}</i>
            <button onClick={() => deleteQuestion(q.question_id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageQuestions;
