/**
 * Quiz‑level CRUD operations
 * --------------------------
 * • All simple reads / writes use Sequelize ORM.
 * • The DELETE route is wrapped in a REPEATABLE_READ transaction
 *   to remove dependent Grades and Questions atomically.
 */

const { Transaction } = require('sequelize');
const sequelize = require('../config/db');

const Quiz     = require('../models/Quiz');
const Question = require('../models/Question');
const Grade    = require('../models/Grade');

/* ───────────────────────────────────────────────
   GET /api/quizzes         (Requirement 1 – list)
   ─────────────────────────────────────────────── */
exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.findAll();
    res.json(quizzes);
  } catch (err) {
    console.error('GET /quizzes error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

/* ───────────────────────────────────────────────
   POST /api/quizzes        (Requirement 1 – create)
   ─────────────────────────────────────────────── */
exports.createQuiz = async (req, res) => {
  const { title, description, teacher_id } = req.body;

  if (!title || !teacher_id) {
    return res.status(400).json({ error: 'Title and teacher_id are required' });
  }

  try {
    const quiz = await Quiz.create({ title, description, teacher_id });
    res.status(201).json({ message: 'Quiz created', id: quiz.quiz_id });
  } catch (err) {
    console.error('POST /quizzes error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

/* ───────────────────────────────────────────────
   DELETE /api/quizzes/:id  (Req 1 + Transaction demo)
   ─────────────────────────────────────────────── */
   exports.deleteQuiz = async (req, res) => {
    const { id: quizId } = req.params;
  
    try {
      await sequelize.transaction(
        { isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ },
        async (t) => {
          /* 1. delete grades (child of quiz) */
          await Grade.destroy   ({ where: { quiz_id: quizId }, transaction: t });
  
          /* 2. delete questions (child of quiz) */
          await Question.destroy({ where: { quiz_id: quizId }, transaction: t });
  
          /* 3. delete quiz (parent) */
          const deleted = await Quiz.destroy({
            where: { quiz_id: quizId },
            transaction: t,
          });
          if (!deleted) throw new Error('Quiz not found');
        }
      );
  
      res.json({ message: 'Quiz, questions, and grades deleted atomically' });
    } catch (err) {
      console.error('TX deleteQuiz error:', err);
      res.status(500).json({ error: err.message });
    }
  };


  