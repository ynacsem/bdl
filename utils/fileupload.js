export async function uploadFiles(apiUrl, factureId, acompteId, files) {
    try {
        // Create a new FormData object
        const formData = new FormData();
        console.log('files from function', files)
        // Append either facture_id or acompte_id to FormData
        if (factureId) {
            formData.append('facture_id', factureId);
        } else if (acompteId) {
            formData.append('acompte_id', acompteId);
        }

        // Append each file and its name to FormData
        files.forEach((file) => {
            formData.append('file_data', file);
            formData.append('file_name', file.name);
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
