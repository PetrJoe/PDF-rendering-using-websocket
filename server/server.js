const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Allow all origins
app.use(cors({
    origin: '*'
}));

// Create uploads folder if it doesn't exist
const uploadFolder = 'uploads';
if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder);
}

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf' || file.mimetype === 'application/x-pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'), false);
        }
    }
});

// Serve the uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Upload PDF endpoint
app.post('/upload', (req, res) => {
  upload.single('pdf')(req, res, function (err) {
      if (err instanceof multer.MulterError) {
          return res.status(400).json({ error: err.message });
      } else if (err) {
          return res.status(400).json({ error: err.message });
      }
      if (!req.file) {
          return res.status(400).send('No file uploaded. Please upload a PDF.');
      }
      res.send({
          message: 'PDF uploaded successfully!',
          filename: req.file.filename
      });
  });
});

// List uploaded PDFs
app.get('/files', (req, res) => {
    fs.readdir(uploadFolder, (err, files) => {
        if (err) {
            return res.status(500).send('Unable to list files');
        }
        const pdfFiles = files.filter(file => path.extname(file) === '.pdf');
        res.json(pdfFiles);
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
