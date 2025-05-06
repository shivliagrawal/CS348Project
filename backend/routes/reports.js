// routes/reports.js

const express = require('express');
const router = express.Router();
const { getQuizStats } = require('../controllers/reportController');

// GET /api/reports/quiz/:quizId
router.get('/quiz/:quizId', getQuizStats);

module.exports = router;
