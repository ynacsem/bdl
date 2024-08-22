import { fetchFiles } from './fetchFiles';

export async function handleDownloadFiles(factureId) {
    try {
        const files = await fetchFiles(factureId);

        files.forEach((file) => {
            const a = document.createElement('a');
            console.log(file);
            a.href = file.url;
            a.download = file.fileName;
            document.body.appendChild(a); // Corrected "appendCHild" to "appendChild"
            a.click();
            document.body.removeChild(a);
        });
    } catch (error) {
        console.error('Failed to download files:', error); // Corrected error logging
    }
}
