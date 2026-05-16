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
  // Clear existing data with DROP to ensure schema updates
  db.run("DROP TABLE IF EXISTS images");
  db.run("DROP TABLE IF EXISTS institutions");
  db.run("DROP TABLE IF EXISTS activities");

  // Re-create tables
  db.run(`CREATE TABLE IF NOT EXISTS institutions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    logo_url TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    institution_id INTEGER,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    FOREIGN KEY(institution_id) REFERENCES institutions(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    drive_link TEXT NOT NULL,
    description TEXT
  )`);

  // Seed institutions
  const stmt = db.prepare("INSERT INTO institutions (name, description, logo_url) VALUES (?, ?, ?)");
  institutions.forEach((name, index) => {
    stmt.run(name, `Descripción breve de la ${name}.`, `https://picsum.photos/seed/${index + 1}/200/200`);
  });
  stmt.finalize();

  // Seed some images for each institution
  const imgStmt = db.prepare("INSERT INTO images (institution_id, url, title, description) VALUES (?, ?, ?, ?)");
  for (let i = 1; i <= 6; i++) {
    for (let j = 1; j <= 4; j++) {
      imgStmt.run(i, `https://picsum.photos/seed/inst${i}img${j}/800/600`, `Imagen ${j}`, `Descripción de la imagen ${j} para la institución ${i}`);
    }
  }
  imgStmt.finalize();

  console.log("Database seeded successfully!");
});
