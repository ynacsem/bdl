import { fetchFacture, fetchLineFact,fetchLign } from './fetch';

// Function to calculate montantTotal for each line item
const calculateMontantTotal = (line) => {
  const { montantU = 0, qte = 0 } = line;
  return parseFloat(montantU) * parseFloat(qte);
};

export const handleEdit = async (searchQuery, setFormData, setTableData) => {
  try {
    // Fetch and sanitize facture data
    const sanitizedData = await fetchFacture(searchQuery);

    // Update form data with sanitized data
    setFormData(sanitizedData);
    setFormData((prevData) => ({
      ...prevData,
      date: prevData.date.split('T')[0],
      date_facture: prevData.date_facture.split('T')[0], // Format date to 'yyyy-MM-dd'
    }));

    console.log(sanitizedData);

    try {
      // Fetch and sanitize table data
      const sanitizedTableData = await fetchLineFact(searchQuery);
    
      // Map over the sanitizedTableData and fetch additional data for each line
      const updatedTableData = await Promise.all(
        sanitizedTableData.map(async (line) => {
          // Fetch additional data using fetchLign
          const data = await fetchLign(line.libelle, false, true);
          const newData = data.results[0];
    
          // Create a new line with updated data
          const updatedLine = {
            ...line,
            codeOperation: newData.cod_op,
            nature: newData.type,
            compte: newData.compte,
            montantTotal: calculateMontantTotal(line) // Add calculated montantTotal
          };
          console.log('updated lines',updatedLine);
          return updatedLine;
        })
      );
    
      // Update the state with processed table data
      setTableData(updatedTableData);
      
    } catch (error) {
      console.error('Error fetching ligne_fact:', error);
    }
    
  } catch (error) {
    console.error('Error fetching facture:', error);
    alert("Wrong ID");
  }
};

