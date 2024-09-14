import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PdfList from './components/PdfList';
import PdfViewer from './components/PdfViewer';
import UploadForm from './components/UploadForm';

const App: React.FC = () => {
  const [pdfFiles, setPdfFiles] = React.useState<string[]>([]);

  const fetchPdfFiles = async () => {
    try {
      const response = await fetch('http://localhost:3000/files');
      const files = await response.json();
      setPdfFiles(files);
    } catch (error) {
      console.error('Error fetching PDF files:', error);
    }
  };

  React.useEffect(() => {
    fetchPdfFiles();
  }, []);

  return (
    <Router>
      <div>
        <h1>PDF Manager</h1>
        <Routes>
          <Route path="/" element={
            <>
              <UploadForm onUploadSuccess={fetchPdfFiles} />
              <PdfList pdfFiles={pdfFiles} />
            </>
          } />
          <Route path="/pdf-viewer" element={<PdfViewer />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;