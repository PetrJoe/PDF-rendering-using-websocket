const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors({ origin: '*' }));

const uploadFolder = 'uploads';
if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder);
}

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
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf' || file.mimetype === 'application/x-pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'), false);
        }
    }
});

app.post('/upload', upload.single('pdf'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded. Please upload a PDF.');
    }
    res.send({
        message: 'PDF uploaded successfully!',
        filename: req.file.filename
    });
});

app.get('/files', (req, res) => {
    fs.readdir(uploadFolder, (err, files) => {
        if (err) {
            return res.status(500).send('Unable to list files');
        }
        const pdfFiles = files.filter(file => path.extname(file).toLowerCase() === '.pdf');
        res.json(pdfFiles);
    });
});

app.get('/pdf/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, uploadFolder, filename);

    if (!fs.existsSync(filePath)) {
        return res.status(404).send('File not found');
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="' + filename + '"');

    const pdfStream = fs.createReadStream(filePath);
    pdfStream.pipe(res);
});

// Serve React app
app.use(express.static(path.join(__dirname, './client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './client/dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});