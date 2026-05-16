import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

app.use('/uploads', express.static(uploadsDir));

const dbPath = path.resolve(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage, limits: { fileSize: 100 * 1024 * 1024 } });

const ADMIN_USER = "admin";
const ADMIN_PASS = "admin123";

const formatDriveLink = (link: string) => {
  if (link.includes('/view')) return link.replace('/view', '/preview').split('?')[0];
  if (!link.includes('/preview')) {
    if (link.includes('/d/')) {
        const parts = link.split('/d/');
        const id = parts[1].split('/')[0];
        return `https://drive.google.com/file/d/${id}/preview`;
    }
  }
  return link;
};

// --- AUTH ---
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) res.json({ success: true, token: "fake-jwt-token" });
  else res.status(401).json({ success: false, message: "Inválido" });
});

// --- INSTITUTIONS ---
app.get('/api/institutions', (req, res) => {
  db.all("SELECT * FROM institutions", (err, rows) => res.json(rows));
});
app.get('/api/institutions/:id', (req, res) => {
  db.get("SELECT * FROM institutions WHERE id = ?", [req.params.id], (err, row) => res.json(row));
});

// --- GALLERY ---
app.get('/api/institutions/:id/images', (req, res) => {
  db.all("SELECT * FROM images WHERE institution_id = ?", [req.params.id], (err, rows) => res.json(rows));
});
app.post('/api/images', upload.single('image'), (req, res) => {
  const { institution_id, title, description, url: extUrl } = req.body;
  const url = req.file ? `/uploads/${req.file.filename}` : extUrl;
  db.run("INSERT INTO images (institution_id, url, title, description) VALUES (?, ?, ?, ?)", [institution_id, url, title, description], function() { res.json({ id: this.lastID, url }); });
});
app.delete('/api/images/:id', (req, res) => {
  db.run("DELETE FROM images WHERE id = ?", [req.params.id], () => res.json({ success: true }));
});

// --- ACTIVITIES ---
app.get('/api/activities', (req, res) => {
  db.all("SELECT * FROM activities", (err, rows) => res.json(rows));
});
app.post('/api/activities', (req, res) => {
  const { name, drive_link, description } = req.body;
  const link = formatDriveLink(drive_link);
  db.run("INSERT INTO activities (name, drive_link, description) VALUES (?, ?, ?)", [name, link, description], function() { res.json({ id: this.lastID }); });
});
app.delete('/api/activities/:id', (req, res) => {
  db.run("DELETE FROM activities WHERE id = ?", [req.params.id], () => res.json({ success: true }));
});

// --- CAROUSEL ---
app.get('/api/carousel', (req, res) => {
  db.all("SELECT * FROM carousel ORDER BY id DESC", (err, rows) => res.json(rows));
});
app.post('/api/carousel', upload.single('image'), (req, res) => {
  const { title, description } = req.body;
  const url = req.file ? `/uploads/${req.file.filename}` : req.body.url;
  db.run("INSERT INTO carousel (url, title, description) VALUES (?, ?, ?)", [url, title, description], function() { res.json({ id: this.lastID, url }); });
});
app.delete('/api/carousel/:id', (req, res) => {
  db.run("DELETE FROM carousel WHERE id = ?", [req.params.id], () => res.json({ success: true }));
});

// --- PROFILES (INMERSIONISTAS) ---
app.get('/api/profiles', (req, res) => {
  db.all("SELECT * FROM profiles", (err, rows) => res.json(rows));
});
app.post('/api/profiles', upload.single('image'), (req, res) => {
  const { name, description, role } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : req.body.image_url;
  db.run("INSERT INTO profiles (name, description, image_url, role) VALUES (?, ?, ?, ?)", [name, description, image_url, role], function() { res.json({ id: this.lastID }); });
});
app.put('/api/profiles/:id', upload.single('image'), (req, res) => {
  const { name, description, role, image_url: oldUrl } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : oldUrl;
  db.run("UPDATE profiles SET name=?, description=?, image_url=?, role=? WHERE id=?", [name, description, image_url, role, req.params.id], () => res.json({ success: true }));
});
app.delete('/api/profiles/:id', (req, res) => {
  db.run("DELETE FROM profiles WHERE id = ?", [req.params.id], () => res.json({ success: true }));
});

app.listen(port, () => console.log(`Server at 3001`));
