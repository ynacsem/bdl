// fetchFacture.js

export const fetchFacture = async (searchQuery) => {
    const field = 'intitule,BAC,BAP,BAPT,id_fournisseur,date,reference_facture,gest,date_fact,type_facture,type_saisie,structure_ord,structure_dest,mode_reglement,montant,observations,num_cheq,rip,etat';
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
    const field = 'intitule,id_fournisseur,date,reference_facture,gest,date_fact,type_facture,type_saisie,stru_ord,stru_dest,mode_reglement,montant,observations,num_cheq,rip,etat,BAC,BAP,BAPT';
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
export async function getData2(
    page = 1,
    itemsPerPage = 10,
    fields = "*",
    table = "facture",
    filters = "",
    order = "id desc"
  ) {
    const offset = (page - 1) * itemsPerPage;
    const limit = itemsPerPage;
  
    // Construct the query parameters
    const query = new URLSearchParams({
      fields,
      table,
      filters,
      order,
      limit,
      offset,
    }).toString();
  
    const URL = `http://localhost:3000/api/getdatapage?${query}`;
  
    try {
      const response = await fetch(URL);
      const data = await response.json();
      return data; // Includes results and totalCount
    } catch (error) {
      console.error("Error fetching data", error);
      return { results: [], totalCount: 0 };
    }
  }
  
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
  export const fetchAllProvision = async () => {
    const field = 'libelle,date,ref,gest,type,montant,etat,date_pro,extourne'; // Include all necessary fields
    const table = 'provision';
    const filters = ''; // Empty filters to fetch all provisions
    const query = new URLSearchParams({ field, table, filters }).toString();
    const url = `/api/getdata?${query}`;

    try {
        const response = await fetch(url);
        const result = await response.json();

        // Check if results are present
        if (!result.results || result.results.length === 0) {
            console.warn('No provisions found.');
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
            date_pro: addOneDay(data.date_pro), // Add formatting for any other date fields as necessary
        }));

        return formattedData;
    } catch (error) {
        console.error('Error fetching all provisions:', error);
        throw error; // Propagate error to caller
    }
};
export const fetchBudgetDetails = async (IDlign_fk, IDstruct_fk) => {
    const table = 'ligndembudget';
    const fields = 'mnt_budg,mnt_eng,mnt_real,IDligndem,mnt_prov';
    
    // Define the join clause
    const joins = 'INNER JOIN dembudget ON ligndembudget.IDdem_fk = dembudget.IDdem';
    
    // Define the filter conditions
    const filters = `ligndembudget.IDlign_fk = ${IDlign_fk},dembudget.IDstruct_fk = ${IDstruct_fk}`;
    
    // Construct the query string
    const query = new URLSearchParams({ fields, table, filters, joins }).toString();
    const url = `/api/getdata?${query}`;
    
    try {
      const response = await fetch(url);
      const result = await response.json();
      console.log(result)
      return result?.results[0];
    } catch (error) {
      console.error('Error fetching budget details:', error);
    }
  };


  export const fetchAllFactures1 = async (limit = 10, offset = 0, searchId = '', searchIntitule = '', selectedTypeFacture = '',selectedTypeSaisie = '', setTotalPages) => {
    const field = 'intitule,id_fournisseur,date,reference_facture,gest,date_facture,type_facture,type_saisie,stru_ord,stru_dest,mode_reglement,montant,observations,num_cheq,rip,etat,BAC,BAP,BAPT';
    const table = 'facture';
    let type_saisie
    if (selectedTypeSaisie ==3) {
         type_saisie =4;
    }else if (selectedTypeSaisie ==4) {
         type_saisie =2;
    }else if (selectedTypeSaisie ==5) {
         type_saisie =5;
    }
    // Construct filters based on provided search parameters
    let filters = [];
    if (searchId) {
        filters.push(`id LIKE '%${searchId}%'`);
    }
    if (searchIntitule) {
        filters.push(`intitule LIKE '%${searchIntitule}%'`);
    }
    if (selectedTypeFacture) {
        filters.push(`type_facture = ${selectedTypeFacture}`);
    }
    if (type_saisie) {
        filters.push(`type_saisie = ${type_saisie}`);
    }
    
    // Join filters with AND
    const filterString = filters.length ? filters.join(' AND ') : '';
    // Construct the query parameters
    const query = new URLSearchParams({
        field,
        table,
        filters: filterString,
        limit,
        offset,
        order:'id'
    }).toString();
    
    const url = `/api/getdatapage?${query}`;

    try {
        const response = await fetch(url);
        const result = await response.json();
        console.log(result)
        if (setTotalPages) {
            setTotalPages(Math.ceil(result.totalCount / limit));
        }

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

  
  
  
