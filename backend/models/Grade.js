// backend/models/Grade.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Grade = sequelize.define(
  'Grade',
  {
    grade_id:   { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    quiz_id:    { type: DataTypes.INTEGER, allowNull: false },
    student_id: { type: DataTypes.INTEGER, allowNull: false },
    score:      { type: DataTypes.FLOAT },
  },
  { tableName: 'Grades', timestamps: false }
);

module.exports = Grade;
