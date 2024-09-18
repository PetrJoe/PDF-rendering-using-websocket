import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CustomPDFViewer from './CustomPDFViewer';

const FileList = () => {
    const [files, setFiles] = useState([]);
    const [selectedPdf, setSelectedPdf] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchFiles = async () => {
        try {
            const response = await axios.get('http://localhost:3000/files');
            setFiles(response.data);
        } catch (error) {
            console.error('Error fetching files:', error);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    const handlePdfClick = async (filename) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`http://localhost:3000/pdf/${filename}`, {
                responseType: 'blob'
            });
            const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
            const pdfUrl = URL.createObjectURL(pdfBlob);
            setSelectedPdf(pdfUrl);
        } catch (error) {
            console.error('Error streaming PDF:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h2>Uploaded PDF Files</h2>
            <ul>
                {files.map((file) => (
                    <li key={file}>
                        <button onClick={() => handlePdfClick(file)} disabled={isLoading}>
                            {file}
                        </button>
                    </li>
                ))}
            </ul>
            {isLoading && <p>Loading PDF...</p>}
            {selectedPdf && !isLoading && (
                <div>
                    <h3>Streamed PDF</h3>
                    <CustomPDFViewer pdfUrl={selectedPdf} />
                </div>
            )}
        </div>
    );
};

export default FileList;
