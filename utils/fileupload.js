export const fileUpload = async (file) => {

    if (file) {
        try {
            const formData = new FormData();
            formData.append('file', file); // Ensure the field name matches

            const response = await fetch('/api/uploadfile', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload file');
            }

            const result = await response.json();

            if (result.success && result.fileId) {
                return result.fileId;
            } else {
                throw new Error('File upload failed');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            
        }
    }
};