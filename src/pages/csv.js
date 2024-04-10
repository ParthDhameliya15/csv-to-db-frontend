import React, { useState } from 'react';
import axios from 'axios';

const UploadCSV = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setMessage('Please select a file.');
            return;
        }
        if (!file.name.endsWith('.csv')) {
            setMessage('Please select a CSV file.');
            return;
        }
        const formData = new FormData();
        formData.append('dataSheet', file);
        
        try {
            const response = await axios.post('http://localhost:8001/upload', formData);
            setMessage(response?.data?.message); // Extract the message property
        } catch (error) {
            setMessage('Error uploading file');
            console.error('Error uploading file:', error);
        }
    };

    return (
        <div>
            <h2>Upload CSV File</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
    <input type="file" name="dataSheet" onChange={handleFileChange} />
    <button type="submit">Upload</button>
</form>

            {message && <p>{message}</p>}
        </div>
    );
};

export default UploadCSV;
