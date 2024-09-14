import React, { useState, useEffect } from 'react';
import UploadForm from './components/UploadForm';
import PdfList from './components/PdfList';

const App = () => {
  const [pdfFiles, setPdfFiles] = useState<string[]>([]);

  const fetchPdfFiles = async () => {
    try {
      const response = await fetch('/api/files');
      const data = await response.json();
      setPdfFiles(data);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  useEffect(() => {
    fetchPdfFiles();
  }, []);

  return (
    <div className="App">
      <h1>PDF Upload and Viewer</h1>
      <UploadForm onUploadSuccess={fetchPdfFiles} />
      <PdfList pdfFiles={pdfFiles} />
    </div>
  );
};

export default App;
