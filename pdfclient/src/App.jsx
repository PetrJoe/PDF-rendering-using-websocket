import React from 'react';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';
import PDFRenderer from './components/PDFRenderer';
import useDisableRightClick from './hooks/useDisableRightClick';

const App = () => {
    useDisableRightClick();

    return (
        <div style={{
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
        }}>
            <h1>PDF API Client</h1>
            <FileUpload />
            <FileList />
            <PDFRenderer />
        </div>
    );
};

export default App;