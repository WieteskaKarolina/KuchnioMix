require('dotenv').config(); // Wczytaj zmienne z pliku .env
const pgp = require('pg-promise')();
const db = pgp({
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD
});

module.exports = db;
