import React, { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist/webpack';
import 'pdfjs-dist/build/pdf.worker.entry';

function App() {
  const [pdfData, setPdfData] = useState<Uint8Array | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Use the provided WebSocket server URL
    const socket = new WebSocket('ws://localhost:3000');

    socket.onopen = () => {
      console.log('WebSocket connection established');
      socket.send('REQUEST_PDF');  // Send request to get PDF
    };

    socket.onmessage = (event) => {
      const arrayBuffer = event.data instanceof ArrayBuffer ? event.data : new Uint8Array(event.data);
      setPdfData(new Uint8Array(arrayBuffer));  // Store the PDF data
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => socket.close();
  }, []);

  useEffect(() => {
    if (pdfData && canvasRef.current) {
      const loadingTask = pdfjsLib.getDocument({ data: pdfData });
      loadingTask.promise.then((pdf) => {
        pdf.getPage(1).then((page) => {
          const viewport = page.getViewport({ scale: 1.0 });
          const canvas = canvasRef.current!;
          const context = canvas.getContext('2d')!;
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          };
          page.render(renderContext);
        });
      }).catch((error) => console.error('Error rendering PDF:', error));
    }
  }, [pdfData]);

  return (
    <div>
      <h1>PDF Viewer</h1>
      {pdfData ? (
        <canvas ref={canvasRef}></canvas>
      ) : (
        <p>Loading PDF...</p>
      )}
    </div>
  );
}

export default App;
