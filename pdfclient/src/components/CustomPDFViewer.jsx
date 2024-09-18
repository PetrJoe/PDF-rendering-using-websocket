import React, { useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/web/pdf_viewer.css';

// Set up the local worker
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

const CustomPDFViewer = ({ pdfUrl }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const loadPDF = async () => {
            if (!pdfUrl) return;

            try {
                const loadingTask = pdfjsLib.getDocument(pdfUrl);
                const pdf = await loadingTask.promise;
                const page = await pdf.getPage(1);

                const scale = 1.5;
                const viewport = page.getViewport({ scale });

                const canvas = canvasRef.current;
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                const renderContext = {
                    canvasContext: context,
                    viewport: viewport,
                };

                await page.render(renderContext);
            } catch (error) {
                console.error('Error rendering PDF:', error);
            }
        };

        loadPDF();
    }, [pdfUrl]);

    const preventRightClick = (e) => {
        e.preventDefault();
    };

    return (
        <div style={{ position: 'relative', overflow: 'hidden' }}>
            <canvas 
                ref={canvasRef}
                onContextMenu={preventRightClick}
                style={{ pointerEvents: 'none' }}
            />
            <div 
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'transparent',
                }}
            />
        </div>
    );
};

export default CustomPDFViewer;
