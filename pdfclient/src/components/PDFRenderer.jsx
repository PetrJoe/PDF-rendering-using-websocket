import React, { useState } from 'react';
import axios from 'axios';

const PDFRenderer = () => {
    const [text, setText] = useState('');
    const [pdfUrl, setPdfUrl] = useState('');

    const handleRender = async () => {
        try {
            const response = await axios.post('http://localhost:3000/render', { text }, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            setPdfUrl(url);
        } catch (error) {
            console.error('Error rendering PDF:', error);
        }
    };

    return (
        <div>
            <h2>Render PDF</h2>
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows="4"
                cols="50"
                placeholder="Enter text to render in PDF"
            />
            <button onClick={handleRender}>Render PDF</button>
            {pdfUrl && (
                <div>
                    <h3>Generated PDF</h3>
                    <iframe src={pdfUrl} width="100%" height="500px" title="Rendered PDF"></iframe>
                </div>
            )}
        </div>
    );
};

export default PDFRenderer;
