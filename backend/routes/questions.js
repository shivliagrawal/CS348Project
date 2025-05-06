const express = require('express');
const router = express.Router();
const Question = require('../models/Question'); // Sequelize model

// GET all questions for a quiz
router.get('/:quizId', async (req, res) => {
  try {
    const questions = await Question.findAll({
      where: { quiz_id: req.params.quizId },
    });
    res.json(questions);
  } catch (err) {
    console.error('GET Questions error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✅ FIXED POST route
router.post('/', async (req, res) => {
    console.log('Incoming Question Data:', req.body); 
  const { quiz_id, question_text, correct_option } = req.body;

  try {
    const newQ = await Question.create({
      quiz_id,
      question_text,
      correct_option,
    });

    res.status(201).json(newQ);
  } catch (err) {
    console.error('POST Questions error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// DELETE question
router.delete('/:id', async (req, res) => {
  try {
    await Question.destroy({ where: { question_id: req.params.id } });
    res.status(204).end();
  } catch (err) {
    console.error('DELETE Questions error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
