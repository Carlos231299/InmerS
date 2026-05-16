import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath);

const institutions = [
  "Institución Educativa Julio Restrepo, sede Delfina Calad Ochoa",
  "Institución Educativa Abelardo Ochoa",
  "Institución Educativa El Concilio, sede Chaquiro Abajo",
  "Institución Educativa El Concilio, sede Epifanio Mejía",
  "Institución Educativa El Concilio, sede Carlos Vieco Ortiz",
  "Hogar Juvenil Campesino"
];

db.serialize(() => {
  db.run("DROP TABLE IF EXISTS images");
  db.run("DROP TABLE IF EXISTS institutions");
  db.run("DROP TABLE IF EXISTS activities");
  db.run("DROP TABLE IF EXISTS carousel");
  db.run("DROP TABLE IF EXISTS profiles");

  db.run(`CREATE TABLE institutions (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, description TEXT, logo_url TEXT)`);
  db.run(`CREATE TABLE images (id INTEGER PRIMARY KEY AUTOINCREMENT, institution_id INTEGER, url TEXT NOT NULL, title TEXT NOT NULL, description TEXT NOT NULL)`);
  db.run(`CREATE TABLE activities (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, drive_link TEXT NOT NULL, description TEXT)`);
  db.run(`CREATE TABLE carousel (id INTEGER PRIMARY KEY AUTOINCREMENT, url TEXT NOT NULL, title TEXT, description TEXT)`);
  db.run(`CREATE TABLE profiles (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, description TEXT, image_url TEXT, role TEXT)`);

  const stmt = db.prepare("INSERT INTO institutions (name, description, logo_url) VALUES (?, ?, ?)");
  institutions.forEach((name, i) => stmt.run(name, `Sede ${name}`, `https://picsum.photos/seed/${i}/200/200`));
  stmt.finalize();

  console.log("DB Seeded with new tables!");
});
