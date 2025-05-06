const express = require('express');
const cors = require('cors');
const app = express();
const sequelize = require('./config/db');

const userRoutes = require('./routes/users');
const reportRoutes = require('./routes/reports');
const quizRoutes = require('./routes/quizzes'); 
const questionRoutes = require('./routes/questions');

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/quizzes', quizRoutes); 
app.use('/api/questions', questionRoutes);

app.get('/', (req, res) => res.send('LMS API Running'));

const PORT = 5050;
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('DB connected');
    console.log(`Server running on port ${PORT}`);
  } catch (err) {
    console.error('Unable to connect to the DB:', err);
  }
});
