const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Enable CORS for all requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Set up storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Serve static files from the "uploads" directory
app.use('/uploads', express.static('uploads'));

// Upload image endpoint
app.post('/upload', upload.single('image'), (req, res) => {
  res.json({ success: true, filename: req.file.filename });
});

// Get all images
app.get('/images', (req, res) => {
  fs.readdir('uploads', (err, files) => {
    if (err) {
      res.status(500).json({ error: 'Failed to retrieve images' });
    } else {
      res.json(files);
    }
  });
});

// Delete image endpoint
app.delete('/delete/:filename', (req, res) => {
  const { filename } = req.params;
  fs.unlink(path.join(__dirname, 'uploads', filename), (err) => {
    if (err) {
      res.status(500).json({ error: 'Failed to delete image' });
    } else {
      res.json({ success: true });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
