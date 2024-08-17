'use client'
import React, { useState } from 'react';

export default function FileUpload() {
    const [file, setFile] = useState(null);
    const [factureId, setFactureId] = useState('');
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleFactureIdChange = (e) => {
        setFactureId(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file || !factureId) {
            setMessage('Please provide both a file and facture ID.');
            return;
        }

        const formData = new FormData();
        formData.append('file_data', file);
        formData.append('facture_id', factureId);

        try {
            const response = await fetch('/api/uploadfile', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (result.success) {
                setMessage(`File uploaded successfully with ID: ${result.fileId}`);
            } else {
                setMessage(`Error: ${result.error}`);
            }
        } catch (error) {
            setMessage('Failed to upload file.');
        }
    };

    return (
        <div>
            <h1>Upload File with Facture ID</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="facture_id">Facture ID:</label>
                    <input
                        type="text"
                        id="facture_id"
                        value={factureId}
                        onChange={handleFactureIdChange}
                    />
                </div>
                <div>
                    <label htmlFor="file">Choose file:</label>
                    <input type="file" id="file" onChange={handleFileChange} />
                </div>
                <button type="submit">Upload</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}
