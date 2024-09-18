const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');

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

// Upload PDF
app.post('/upload', upload.single('pdf'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded. Please upload a PDF.');
    }
    res.send({
        message: 'PDF uploaded successfully!',
        filename: req.file.filename
    });
});

// List PDF files
app.get('/files', (req, res) => {
    fs.readdir(uploadFolder, (err, files) => {
        if (err) {
            return res.status(500).send('Unable to list files');
        }
        const pdfFiles = files.filter(file => path.extname(file).toLowerCase() === '.pdf');
        res.json(pdfFiles);
    });
});

// Stream PDF file with additional headers
app.get('/pdf/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, uploadFolder, filename);

    if (!fs.existsSync(filePath)) {
        return res.status(404).send('File not found');
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="' + filename + '"');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-Content-Type-Options', 'nosniff');

    const pdfStream = fs.createReadStream(filePath);
    pdfStream.pipe(res);
});

// Render PDF API
app.post('/render', express.json(), async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).send('No text provided for PDF rendering.');
    }

    try {
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage();
        const { width, height } = page.getSize();
        
        // You can customize text settings here
        const fontSize = 30;
        page.drawText(text, {
            x: 50,
            y: height - fontSize - 50,
            size: fontSize,
        });

        const pdfBytes = await pdfDoc.save();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="rendered.pdf"');
        res.send(pdfBytes);
    } catch (error) {
        res.status(500).send('Error rendering PDF: ' + error.message);
    }
});

// Serve React app
// app.use(express.static(path.join(__dirname, 'dist')));

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'dist', 'index.html'));
// });

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
