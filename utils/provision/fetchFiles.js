export async function fetchFiles(prov_id){
    try {
        const response = await fetch(`/api/getfile?provision_id=${prov_id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const files = await response.json();
    
        const fileBlobs = files.map((file)=>{
            const blob = new Blob([new Uint8Array(file.file_data.data)],{
                type:'application/pdf'
            })
            const url = URL.createObjectURL(blob);
            return{
                fileName:file.file_name,
                url,
                id:file.id
            }
        })
        return fileBlobs

    } catch (error) {
        console.error('Error fetching files:', error);
        throw error;
    }
}