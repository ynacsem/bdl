export const fetchProvision = async (searchQuery) => {
    const fields = 'date_extourne,id,type,intitule,id_fournisseur,montant,ref,date,stru_ord,stru_dest,observations,etat,gest,extourne,date,date_pro';
    const table = 'provision';
    let filters = '';

    if (searchQuery) {
        filters = `id = ${searchQuery}`; // Apply filter if searchQuery is provided
    }
    const query = new URLSearchParams({ fields, table, filters }).toString();
    const url = `/api/getdata?${query}`;

    try {
        const response = await fetch(url);
        const result = await response.json();

        // Replace null values with empty strings
        let sanitizedData = Object.fromEntries(
            Object.entries(result.results[0]).map(([key, value]) => [key, value === null ? '' : value])
        );

        // Function to check if a date is valid
        const isValidDate = (dateString) => {
            const date = new Date(dateString);
            return !isNaN(date.getTime());
        };

        // Function to add one day to a valid date
        const addOneDay = (dateString) => {
            if (!isValidDate(dateString) || dateString === '0000-00-00') {
                return ''; // Return empty string for invalid or placeholder dates
            }

            const date = new Date(dateString);
            date.setDate(date.getDate() + 1); // Add one day
            return date.toISOString().split('T')[0]; // Return in 'yyyy-mm-dd' format
        };

        // Format the date fields with one day added
        sanitizedData = {
            ...sanitizedData,
            date: addOneDay(sanitizedData.date),
            date_pro: addOneDay(sanitizedData.date_pro),
            date_extourne: addOneDay(sanitizedData.date_extourne),
        };

        return sanitizedData;
    } catch (error) {
        console.error('Error fetching facture:', error);
        throw error; // Propagate error to caller
    }
};


export const fetchLineProvision = async (searchQuery) => {
    const fields = 'id,libelle,montantU,TVA,qte,mnt_rest';
    const table = 'pro_ligne';
    const filters = `id_prov = ${searchQuery}`; // Use the search query passed as a parameter
    const query = new URLSearchParams({ fields, table, filters }).toString();
    const url = `/api/getdata?${query}`;

    try {
        const response = await fetch(url);
        const result = await response.json();

        // Replace null values with empty strings and add code_op field
        const sanitizedTableData = result.results
    .map((item) =>
        Object.fromEntries(
            Object.entries(item)
                .map(([key, value]) => [key, value === null ? '' : value])
                .map(([key, value]) => [key === 'mnt_rest' ? 'montantRestant' : key, value])
        )
    )
    .map((item) => ({
        ...item,
        codeOperation: '',
        restInitiale: item.montantRestant, // Add code_op field with an empty string
    }));


        console.log(sanitizedTableData);
        return sanitizedTableData;
    } catch (error) {
        console.error('Error fetching ligne_prov:', error);
        throw error; // Propagate error to caller
    }
};
export const fetchLign = async (fil, isOp, isFilter) => {
    const table = 'lignbbudget';
    let fields = 'libelle';
    let filters = '';
  
    if (isFilter) {
      fields = 'libelle,cod_op,compte,type';
      // Check if `fil` is a string or a number and apply the correct formatting
      const formattedFil = typeof fil === 'string' ? `'${fil}'` : fil;
      filters = isOp ? `cod_op = ${formattedFil}` : `libelle = ${formattedFil}`;
    }
  
    const query = new URLSearchParams({ fields, table, filters }).toString();
    const url = `/api/getdata?${query}`;
  
    try {
      const response = await fetch(url);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching libelle:', error);
    }
  };