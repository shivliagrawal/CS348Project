const Quiz = require('../models/Quiz');
const sequelize = require('../config/db');
const { Transaction } = require('sequelize');
const Question = require('../models/Question');


exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.findAll();
    res.json(quizzes);
  } catch (err) {
    console.error('GET error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.createQuiz = async (req, res) => {
  const { title, description, teacher_id } = req.body;

  console.log('Incoming data:', req.body);

  if (!title || !teacher_id) {
    return res.status(400).json({ error: 'Title and teacher_id are required' });
  }

  try {
    const quiz = await Quiz.create({ title, description, teacher_id });
    res.status(201).json({ message: 'Quiz created', id: quiz.quiz_id });
  } catch (err) {
    console.error('POST error:', err.message);
    res.status(500).json({ error: err.message });
  }
};


exports.deleteQuiz = async (req, res) => {
  const { id: quizId } = req.params;

  try {
    await sequelize.transaction(
      { isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ },
      async (t) => {
        // 1. delete children
        await Question.destroy({ where: { quiz_id: quizId }, transaction: t });

        // 2. delete parent
        const deleted = await Quiz.destroy({
          where: { quiz_id: quizId },
          transaction: t,
        });
        if (!deleted) throw new Error('Quiz not found');
      }
    );

    res.json({ message: 'Quiz and its questions deleted atomically' });
  } catch (err) {
    console.error('TX deleteQuiz error:', err);
    res.status(500).json({ error: err.message });
  }
};
