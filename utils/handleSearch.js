// handleSearch.js

import { fetchFacture,fetchLineFact } from './fetch';


export const handleSearch = async (e, searchQuery, setFormData, setTableData, setIsSearch) => {
    e.preventDefault(); // Prevent default form submission behavior
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

            setTableData(sanitizedTableData);  
            setIsSearch(false);

        } catch (error) {
            console.error('Error fetching ligne_fact:', error);
        }
    } catch (error) {
        console.error('Error fetching facture:', error);
        alert("wrong id");
    }
};
