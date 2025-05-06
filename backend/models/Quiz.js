const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Quiz = sequelize.define('Quiz', {
  quiz_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  teacher_id: { type: DataTypes.INTEGER, allowNull: false },
}, {
  tableName: 'Quizzes',
  timestamps: false
});

module.exports = Quiz;
