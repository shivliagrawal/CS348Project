// backend/config/db.js
//-----------------------------------------------------------
//  Flexible Sequelize setup
//  • Local dev  -> MySQL  (same as before)
//  • Cloud demo -> SQLite (Render free tier)         👈
//  If you ever switch to PlanetScale/Railway, just
//  set DATABASE_URL to the mysql://... string.
//-----------------------------------------------------------
const { Sequelize } = require('sequelize');

let sequelize;

if (process.env.DATABASE_URL) {
  // ---- Cloud MySQL / Postgres (future‑proof) ----
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'mysql',              // change to 'postgres' if you use PG later
    logging: console.log,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Render/PlanetScale self‑signed certs
      },
    },
  });
  console.log('🔗 Using DATABASE_URL for remote DB');
} else {
  // ---- Local development (unchanged) ----
  sequelize = new Sequelize('lms_project', 'root', 'Shivli@2003', {
    host: 'localhost',
    dialect: 'mysql',
    logging: console.log,
  });
  console.log('🐬 Using local MySQL');
}

// ---- Fallback for Render free tier: SQLite file ----
if (process.env.RENDER === 'true' && !process.env.DATABASE_URL) {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'lms.sqlite',   // persisted on Render’s disk
    logging: console.log,
  });
  console.log('📦 Using SQLite on Render');
}

module.exports = sequelize;
