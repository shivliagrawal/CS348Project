const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('lms_project', 'root', 'Shivli@2003', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
