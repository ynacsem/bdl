// fetchFacture.js

export const fetchFacture = async (searchQuery) => {
    const field = 'intitule,id_fournisseur,date,reference_facture,gest,date_fact,type_facture,type_saisie,structure_ord,structure_dest,mode_reglement,montant,observations,num_cheq,rip,etat';
    const table = 'facture';
    let filters = '';

    if (searchQuery) {
        filters = `id = ${searchQuery}`; // Apply filter if searchQuery is provided
    }
    const query = new URLSearchParams({ field, table, filters }).toString();
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
            date_facture: addOneDay(sanitizedData.date_facture),
        };

        return sanitizedData;
    } catch (error) {
        console.error('Error fetching facture:', error);
        throw error; // Propagate error to caller
    }
};


export const fetchLineFact = async (searchQuery) => {
    const field = 'id,libelle,montantU,TVA,qte';
    const table = 'ligne_fact';
    const filters = `id_facture = ${searchQuery}`; // Use the search query passed as a parameter
    const query = new URLSearchParams({ field, table, filters }).toString();
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
                .map(([key, value]) => [key === 'TVA' ? 'codeTVA' : key, value])
        )
    )
    .map((item) => ({
        ...item,
        codeOperation: '', // Add code_op field with an empty string
    }));


        console.log(sanitizedTableData);
        return sanitizedTableData;
    } catch (error) {
        console.error('Error fetching ligne_fact:', error);
        throw error; // Propagate error to caller
    }
};

export const fetchStructure = async () => {
    const field = 'libelle,IDstruct';
    const table = 'structure';
    const filters = '';
    const query = new URLSearchParams({ field, table, filters }).toString();
    const url = `/api/getdata?${query}`;
    try {
        const response = await fetch(url);
        const result = await response.json();
        return result;
    } catch (error) {
        console.log(error);
    }
}
export const fetchAllFactures = async () => {
    const field = 'intitule,id_fournisseur,date,reference_facture,gest,date_fact,type_facture,type_saisie,structure_ordonnatrice,structure_destinataire,mode_reglement,montant,observations,num_cheq,rip,etat';
    const table = 'facture';
    const filters = ''; // Empty filters to fetch all factures
    const query = new URLSearchParams({ field, table, filters }).toString();
    const url = `/api/getdata?${query}`;

    try {
        const response = await fetch(url);
        const result = await response.json();

        // Check if results are present
        if (!result.results || result.results.length === 0) {
            console.warn('No factures found.');
            return [];
        }

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

        // Sanitize all entries in results
        const sanitizedData = result.results.map(entry => 
            Object.fromEntries(
                Object.entries(entry).map(([key, value]) => [key, value === null ? '' : value])
            )
        );

        // Format the date fields with one day added
        const formattedData = sanitizedData.map(data => ({
            ...data,
            date: addOneDay(data.date),
            date_facture: addOneDay(data.date_facture),
        }));

        return formattedData;
    } catch (error) {
        console.error('Error fetching all factures:', error);
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
  
  
