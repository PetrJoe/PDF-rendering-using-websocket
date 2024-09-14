import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

const PdfViewer: React.FC = () => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const location = useLocation();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const file = searchParams.get('file');

        if (file && iframeRef.current) {
            const pdfUrl = `/pdf/${encodeURIComponent(file)}`;
            iframeRef.current.src = pdfUrl;

            // Check if the PDF loads correctly
            fetch(pdfUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                })
                .catch(e => {
                    console.error('Error loading PDF:', e);
                    setError('Failed to load PDF. Please try again later.');
                });
        } else {
            setError('No PDF file specified.');
        }
    }, [location]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div style={{ overflow: 'hidden' }}>
            <iframe
                ref={iframeRef}
                title="PDF Viewer"
                sandbox="allow-scripts"
            />
        </div>
    );
};

export default PdfViewer;