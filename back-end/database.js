const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const CONFIG = require('./config');

const dbFilePath = path.join(__dirname, CONFIG.DATABASE_FILE);

const db = new sqlite3.Database(dbFilePath, (err) => {
  if (err) console.error("Error al conectar a la base de datos:", err);
  else console.log("Conectado a la base de datos SQLite");
})

module.exports = db;
