import { fetchAcompte, fetchAcompteDetails,fetchFilesByAcompteId } from './fetch';

// Function to calculate montantTotal for each line item (if needed)


export const handleSearch = async (idAcompte, setFormData, setTableData,setFiles) => {
  try {
    // Fetch and sanitize data for acompte
    let sanitizedFormData = await fetchAcompte(idAcompte);

    setFormData(sanitizedFormData);
    setFormData((prevData) => ({
      ...prevData,
      date: prevData.date.split('T')[0],
      dateacmpt: prevData.dateacmpt.split('T')[0], // Format date to 'yyyy-MM-dd'
    }));

    console.log('Form Data:', sanitizedFormData);
    try {
      const sanitizedFiles = await fetchFilesByAcompteId(idAcompte);
      setFiles(sanitizedFiles);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
    try {
      // Fetch and sanitize details for acompte
      const sanitizedTableData = await fetchAcompteDetails(idAcompte);

      // Optionally calculate montantTotal if relevant to this table
      

      setTableData(sanitizedTableData);
      

    } catch (error) {
      console.error('Error fetching acompte details:', error);
    }
  } catch (error) {
    console.error('Error fetching acompte:', error);
    alert("Wrong ID");
  }
};
