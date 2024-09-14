import { Link } from 'react-router-dom';

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
                            <Link to={`/pdf-viewer?file=${encodeURIComponent(pdfFile)}`}>
                                {pdfFile}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default PdfList;