import { fetchFacture, fetchLineFact } from './fetch';

// Function to calculate montantTotal for each line item
const calculateMontantTotal = (line) => {
  const { montantU = 0, qte = 0 } = line;
  return parseFloat(montantU) * parseFloat(qte);
};

export const handleEdit = async (searchQuery, setFormData, setTableData) => {
  try {
    let sanitizedData = await fetchFacture(searchQuery);

    setFormData(sanitizedData);
    setFormData((prevData) => ({
      ...prevData,
      date: prevData.date.split('T')[0],
      date_facture: prevData.date_facture.split('T')[0], // Format date to 'yyyy-MM-dd'
    }));

    console.log(sanitizedData);

    try {
      const sanitizedTableData = await fetchLineFact(searchQuery);

      // Calculate montantTotal for each line item
      const processedTableData = sanitizedTableData.map(line => ({
        ...line,
        montantTotal: calculateMontantTotal(line), // Add calculated montantTotal
      }));

      setTableData(processedTableData);  

    } catch (error) {
      console.error('Error fetching ligne_fact:', error);
    }
  } catch (error) {
    console.error('Error fetching facture:', error);
    alert("Wrong ID");
  }
};
