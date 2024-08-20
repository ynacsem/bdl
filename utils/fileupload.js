async function uploadFiles(apiUrl, factureId, files) {
    try {
        // Create a new FormData object
        const formData = new FormData();
        
        // Append facture_id to FormData
        formData.append('facture_id', factureId);
        
        // Append each file to FormData
        files.forEach((file) => {
            formData.append('file_data', file);
        });

        // Send POST request to API
        const response = await fetch(apiUrl, {
            method: 'POST',
            body: formData,
        });

        // Check if the response is OK
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse the JSON response
        const result = await response.json();

        // Return the result
        return result;
    } catch (error) {
        console.error('Error uploading files:', error);
        throw error;
    }
}
