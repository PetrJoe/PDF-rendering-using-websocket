import { useState, ChangeEvent, FormEvent } from 'react';

interface UploadFormProps {
  onUploadSuccess: () => void;
}

const UploadForm = ({ onUploadSuccess }: UploadFormProps) => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setPdfFile(file);
    setErrorMessage('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!pdfFile) {
      setErrorMessage('Please select a PDF file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('pdf', pdfFile);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed.');
      }

      onUploadSuccess();
      setPdfFile(null); // Reset the form
    } catch (error) {
      console.error('Error uploading file:', error);
      setErrorMessage('Failed to upload file.');
    }
  };

  return (
    <div>
      <h2>Upload PDF</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default UploadForm;
