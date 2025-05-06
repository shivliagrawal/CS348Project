// server.js
//-----------------------------------------------------------
//  Express bootstrap
//  • Uses dynamic PORT when present (Render sets it)
//  • Runs sequelize.authenticate() + sync() once at startup
//-----------------------------------------------------------
const express    = require('express');
const cors       = require('cors');
const sequelize  = require('./config/db');

const userRoutes     = require('./routes/users');
const reportRoutes   = require('./routes/reports');
const quizRoutes     = require('./routes/quizzes');
const questionRoutes = require('./routes/questions');

const app = express();
app.use(cors());
app.use(express.json());

// --- API routes -----
app.use('/api/users',    userRoutes);
app.use('/api/reports',  reportRoutes);
app.use('/api/quizzes',  quizRoutes);
app.use('/api/questions', questionRoutes);

// simple health check for Render uptime pings
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.get('/',           (req, res) => res.send('LMS API Running'));

// --- start server ---
const PORT = process.env.PORT || 5050;

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();        // creates tables if they don’t exist
    console.log('✅ DB connected');

    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  } catch (err) {
    console.error('❌ Unable to connect to the DB:', err);
    process.exit(1);
  }
})();
