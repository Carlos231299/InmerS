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
  db.run("DROP TABLE IF EXISTS logos");

  db.run(`CREATE TABLE institutions (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, description TEXT, logo_url TEXT)`);
  db.run(`CREATE TABLE images (id INTEGER PRIMARY KEY AUTOINCREMENT, institution_id INTEGER, url TEXT NOT NULL, title TEXT NOT NULL, description TEXT NOT NULL)`);
  db.run(`CREATE TABLE activities (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, drive_link TEXT NOT NULL, description TEXT)`);
  db.run(`CREATE TABLE carousel (id INTEGER PRIMARY KEY AUTOINCREMENT, url TEXT NOT NULL, title TEXT, description TEXT)`);
  db.run(`CREATE TABLE profiles (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, description TEXT, image_url TEXT, role TEXT)`);
  db.run(`CREATE TABLE logos (id INTEGER PRIMARY KEY AUTOINCREMENT, url TEXT NOT NULL)`);

  const stmt = db.prepare("INSERT INTO institutions (name, description, logo_url) VALUES (?, ?, ?)");
  institutions.forEach((name, i) => stmt.run(name, `Sede ${name}`, `https://picsum.photos/seed/${i}/200/200`));
  stmt.finalize();

  const carouselStmt = db.prepare("INSERT INTO carousel (url, title, description) VALUES (?, ?, ?)");
  carouselStmt.run("https://picsum.photos/seed/festival/1920/1080", "Festival por la Vida", "Bienvenidos a nuestro festival. Transformando el territorio con educación y cultura.");
  carouselStmt.finalize();

  const profilesStmt = db.prepare("INSERT INTO profiles (name, description, image_url, role) VALUES (?, ?, ?, ?)");
  profilesStmt.run(
    "ROSA ESTHER MOSQUERA ASPRILLA",
    "Como practicante en el Festival de la Vida, mi objetivo es fortalecer mi quehacer profesional, potenciar mis habilidades blandas y acompañar a los estudiantes en su proceso de aprendizaje desde un enfoque integral, contribuyendo a la formación de seres humanos íntegros, conscientes y defensores de la vida, para así tener un impacto positivo en su desarrollo personal y en la sociedad.",
    "https://picsum.photos/seed/rosa/400/500",
    "Lic. en Ciencias Naturales y Ed. Ambiental - 8° Semestre"
  );
  profilesStmt.run(
    "SARA CATALINA CORDOBA RUEDA",
    "Mi formación se ha fundamentado a partir de principios y valores que permiten desenvolverme en el entorno social y formativo con calidez humana, transparencia y respeto. Como psicóloga, busco ayudar a transformar vidas y acompañar procesos para un mejor futuro con vocación y servicio.",
    "https://picsum.photos/seed/sara/400/500",
    "Estudiante de Psicología - 9° Semestre"
  );
  profilesStmt.run(
    "JESUS DAVID RAMIREZ AMAYA",
    "Mi formación se ha basado en la implementación de valores primarios del ser humano y la construcción del mismo en la sociedad. Me interesa el deporte, el arte y todo lo relacionado con cultura ancestral, búsqueda del ser y la apropiación de nuestro entorno.",
    "https://picsum.photos/seed/jesus/400/500",
    "Estudiante de Psicología - 9° Semestre"
  );
  profilesStmt.finalize();

  const logosStmt = db.prepare("INSERT INTO logos (url) VALUES (?)");
  for (let i = 1; i <= 6; i++) {
    logosStmt.run(`https://picsum.photos/seed/logo${i}/150/80`);
  }
  logosStmt.finalize();

  console.log("DB Seeded with new tables, initial carousel, profiles, and logos!");
});
