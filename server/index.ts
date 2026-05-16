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

// Increased limits for large image uploads
app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));

const dbPath = path.resolve(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath);

// Multer configuration with 100MB limit
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ 
  storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB
});

// Basic Auth for Admin (Hardcoded for now)
const ADMIN_USER = "admin";
const ADMIN_PASS = "admin123";

// Helper to format Drive links to preview
const formatDriveLink = (link: string) => {
  if (link.includes('/view')) {
    return link.replace('/view', '/preview').split('?')[0];
  }
  if (!link.includes('/preview')) {
    if (!link.includes('http')) {
       return `https://drive.google.com/file/d/${link}/preview`;
    }
    if (link.includes('/d/')) {
        const parts = link.split('/d/');
        const id = parts[1].split('/')[0];
        return `https://drive.google.com/file/d/${id}/preview`;
    }
  }
  return link;
};

// --- AUTH ENDPOINTS ---
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    res.json({ success: true, token: "fake-jwt-token" });
  } else {
    res.status(401).json({ success: false, message: "Credenciales inválidas" });
  }
});

// --- INSTITUTIONS ---
app.get('/api/institutions', (req, res) => {
  db.all("SELECT * FROM institutions", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/institutions/:id', (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM institutions WHERE id = ?", [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
});

// --- IMAGES (GALLERY) ---
app.get('/api/institutions/:id/images', (req, res) => {
  const { id } = req.params;
  db.all("SELECT * FROM images WHERE institution_id = ?", [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/images', upload.single('image'), (req, res) => {
  const { institution_id, title, description, url: externalUrl } = req.body;
  
  // Use relative path for universal compatibility
  const imageUrl = req.file 
    ? `/uploads/${req.file.filename}` 
    : externalUrl;

  if (!imageUrl) {
    return res.status(400).json({ error: "Se requiere una imagen (archivo o URL)" });
  }

  db.run("INSERT INTO images (institution_id, url, title, description) VALUES (?, ?, ?, ?)", 
    [institution_id, imageUrl, title, description], 
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, url: imageUrl });
    }
  );
});

app.delete('/api/images/:id', (req, res) => {
  const { id } = req.params;
  
  db.get("SELECT url FROM images WHERE id = ?", [id], (err, row) => {
    if (row && row.url.includes('/uploads/')) {
      const fileName = row.url.split('/uploads/')[1];
      const filePath = path.join(uploadsDir, fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    db.run("DELETE FROM images WHERE id = ?", [id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    });
  });
});

// --- ACTIVITIES ---
app.get('/api/activities', (req, res) => {
  db.all("SELECT * FROM activities", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/activities', (req, res) => {
  const { name, drive_link, description } = req.body;
  const formattedLink = formatDriveLink(drive_link);
  db.run("INSERT INTO activities (name, drive_link, description) VALUES (?, ?, ?)", 
    [name, formattedLink, description], 
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, drive_link: formattedLink });
    }
  );
});

app.put('/api/activities/:id', (req, res) => {
  const { id } = req.params;
  const { name, drive_link, description } = req.body;
  const formattedLink = formatDriveLink(drive_link);
  db.run("UPDATE activities SET name = ?, drive_link = ?, description = ? WHERE id = ?", 
    [name, formattedLink, description, id], 
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, drive_link: formattedLink });
    }
  );
});

app.delete('/api/activities/:id', (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM activities WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
