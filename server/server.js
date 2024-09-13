const express = require('express');
const { Server } = require('ws');
const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');

const app = express();
const PORT = 3000;

// Serve React app files (built with Vite)
app.use(express.static(path.join(__dirname, 'public')));

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

      // Use pdf-lib to manipulate or process the PDF (optional)
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pdfData = await pdfDoc.save();

      // Send the PDF as a binary buffer
      ws.send(pdfData);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});
