import React, { useState, useEffect } from 'react';

function App() {
  const [pdfData, setPdfData] = useState(null);

  useEffect(() => {
    // Use the provided WebSocket server URL
    const socket = new WebSocket('wss://potential-space-waffle-xp9jxx76gjgfg7g-3000.app.github.dev');

    socket.onopen = () => {
      console.log('WebSocket connection established');
      socket.send('REQUEST_PDF');  // Send request to get PDF
    };

    socket.onmessage = (event) => {
      const blob = new Blob([event.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfData(url);  // Store the PDF data URL
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => socket.close();
  }, []);

  return (
    <div>
      <h1>PDF Viewer</h1>
      {pdfData ? (
        <iframe src={pdfData} width="100%" height="600px" title="PDF Viewer"></iframe>
      ) : (
        <p>Loading PDF...</p>
      )}
    </div>
  );
}

export default App;
