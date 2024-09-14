// server.js (Node.js backend)
const express = require('express');
const { Server } = require('ws');
const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');

const app = express();
const PORT = 3000;

// Serve static files from Vite build
app.use(express.static(path.join(__dirname, 'public')));

// Serve PDF directly from HTTP route
app.get('/pdf', async (req, res) => {
  try {
    const pdfPath = path.join(__dirname, 'sample.pdf');
    const pdfBytes = fs.readFileSync(pdfPath);

    // Optionally process the PDF using pdf-lib
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pdfData = await pdfDoc.save();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="sample.pdf"');
    res.send(pdfData);
  } catch (error) {
    console.error('Error serving PDF:', error);
    res.status(500).send('Internal Server Error');
  }
});

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const wss = new Server({ server });

wss.on('connection', async (ws) => {
  console.log('Client connected');

  ws.on('message', async (message) => {
    console.log('Received message:', message);

    if (message === 'REQUEST_PDF') {
      const pdfPath = path.join(__dirname, 'sample.pdf');
      const pdfBytes = fs.readFileSync(pdfPath);

      // Optionally process the PDF using pdf-lib
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pdfData = await pdfDoc.save();

      // Send the PDF as a binary buffer to the client
      ws.send(pdfData);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});
