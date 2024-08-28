//test if we have an acompte with this frs or no to alert him 

export const fetchFrsAcompte = async (idFrs) => {
    const field = 'id_fournisseur'
    const table = 'acompte'
    const filters = `id_fournisseur = ${idFrs}`
    const query = new URLSearchParams({ field, table, filters }).toString()
    const url = `/api/getdata?${query}`
    try {
        const response = await fetch(url)
        const result = await response.json()
        if (result.results.length > 0) {
            alert('Ce fournisseur a déjà un acompte !')
        }
    } catch (error) {
        console.error('Error fetching facture:', error)
        throw error // Propagate error to caller
    }
}


export const factureEtat = (formData) => {
    const isObjectEmptyOrNull = (obj) => {
        // Iterate through each key-value pair in the object
        for (let key in obj) {
            if (obj[key] === null || obj[key] === '') {
                console.log(`${key} is empty or null`); // Log the key name
                return true; // Return true if any value is null or empty
            }
        }
        return false;
    };

    // Check if formData is an array
    if (Array.isArray(formData)) {
        // If it's an array, iterate over each object in the array
        for (let item of formData) {
            if (isObjectEmptyOrNull(item)) {
                return 3; // Return 3 if any object has an empty or null field
            }
        }
    } else if (typeof formData === 'object') {
        // If it's a single object, check it directly
        if (isObjectEmptyOrNull(formData)) {
            return 3; // Return 3 if the object has an empty or null field
        }
    }

    return 1; // Return 1 if all fields are valid (not null or empty)
};

