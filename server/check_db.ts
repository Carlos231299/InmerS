import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, rows) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("Tables:", rows.map(r => r.name));
  });

  db.all("PRAGMA table_info(images)", (err, rows) => {
    console.log("Columns in images:", rows.map(r => r.name));
  });
});
