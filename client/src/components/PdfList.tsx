import React from 'react';

interface PdfListProps {
    pdfFiles: string[];
}

function PdfList({ pdfFiles }: PdfListProps) {
    return (
        <div>
            <h2>Uploaded PDFs</h2>
            {pdfFiles.length === 0 ? (
                <p>No PDFs uploaded yet.</p>
            ) : (
                <ul>
                    {pdfFiles.map((pdfFile, index) => (
                        <li key={index}>
                            <a href={`http://localhost:3000/uploads/${pdfFile}`} target="_blank" rel="noopener noreferrer">
                                {pdfFile}
                            </a>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default PdfList;
