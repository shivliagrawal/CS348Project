// controllers/reportController.js

const db = require('../config/db');
const { QueryTypes } = require('sequelize');

exports.getQuizStats = async (req, res) => {
  const { quizId } = req.params;  // e.g. /quiz/1 => quizId = 1

  try {
    // Debug logs to confirm the incoming quizId
    console.log('===== REPORT CONTROLLER DEBUG LOGS =====');
    console.log('quizId is:', quizId);

    // 1) Average Score Query
    console.log('About to run AVG score query...');
    const avgResult = await db.query(
      'SELECT AVG(score) AS average FROM Grades WHERE quiz_id = ?',
      {
        replacements: [quizId],
        type: QueryTypes.SELECT,
      }
    );
    console.log('avgResult:', avgResult); // Debug the raw result array

    // 2) Student Scores (JOIN Users)
    console.log('About to run student scores query (JOIN) ...');
    const studentScores = await db.query(
      `SELECT u.name, g.score
       FROM Grades g
       JOIN Users u ON g.student_id = u.user_id
       WHERE g.quiz_id = ?`,
      {
        replacements: [quizId],
        type: QueryTypes.SELECT,
      }
    );
    console.log('studentScores:', studentScores);

    // Build a response object
    console.log('Sending JSON response now...');
    res.json({
      average: avgResult[0].average || 0,
      studentScores,
    });
  } catch (err) {
    console.error('Report error:', err.message);
    res.status(500).json({ error: err.message });
  }
};
