export const fetchAcompte = async (searchQuery) => {
    const field = 'id,type_facture,id_fournisseur,id_fact,stru_ord,stru_dest,libelle_acompte,date,numacmpt,montant,observations,dateacmpt,gest';
    const table = 'acompte';
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
            dateacmpt: addOneDay(sanitizedData.dateacmpt),
        };

        return sanitizedData;
    } catch (error) {
        console.error('Error fetching acompte:', error);
        throw error; // Propagate error to caller
    }
};
export const fetchAcompteDetails = async (idAcompte) => {
    const field = 'id,id_acompte,gestionnaire_bap,solde_a_encaisser,date_echeance,date_valuer,date_forcage_remboursement,date_encaissement,num_cheque,ref_pointage,ref_a_rappeler,mode_encaisement,numero,compte';
    const table = 'remboursement';
    let filters = '';

    if (idAcompte) {
        filters = `id_acompte = ${idAcompte}`; // Apply filter if idAcompte is provided
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
            date_echeance: addOneDay(sanitizedData.date_echeance),
            date_valuer: addOneDay(sanitizedData.date_valuer),
            date_forcage_remboursement: addOneDay(sanitizedData.date_forcage_remboursement),
            date_encaissement: addOneDay(sanitizedData.date_encaissement),
        };
        console.log(sanitizedData)
        return sanitizedData;
    } catch (error) {
        console.error('Error fetching acompte details:', error);
        throw error; // Propagate error to caller
    }
};
export const fetchAllAcomptes = async () => {
    const field = 'id,type_facture,date,montant,gest,libelle_acompte'
    const table = 'acompte'
    const query = new URLSearchParams({ field, table }).toString();
    const url = `/api/getdata?${query}`;
    try {
        const response = await fetch(url);
        const result = await response.json();
        if(!result.results ||result.results.length === 0){
            console.warn('No acomptes found');
            return [];
        }
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
        const formattedData = sanitizedData.map(data => ({
            ...data,
            date: addOneDay(data.date),
            
        }));

        return formattedData;
    } catch (error) {
        console.error('Error fetching all factures:', error);
        throw error; // Propagate error to caller
    }
}