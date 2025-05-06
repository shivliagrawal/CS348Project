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
  const sqlite = require('better-sqlite3');  // 👈 manually use the better driver

  sequelize = new Sequelize({
    dialect: 'sqlite',
    dialectModule: sqlite,                 // 👈 inject better-sqlite3
    storage: 'lms.sqlite',
    logging: console.log,
  });

  console.log('📦 Using better-sqlite3 on Render');
}

module.exports = sequelize;
