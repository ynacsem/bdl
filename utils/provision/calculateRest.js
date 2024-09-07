export const calculateRest = async (filter) => {
    const fields = 'mnt_rest';
    const table = 'pro_ligne';
    const filters = `id_prov = '${filter}'`;
    const query = new URLSearchParams({ fields, table, filters }).toString();
    const url = `/api/getdata?${query}`;

    try {
        const response = await fetch(url);
        const result = await response.json();

        // Access the results array within the result object
        const data = result.results;

        // Check if data is an array of objects with mnt_rest property
        if (!Array.isArray(data) || !data.every(item => typeof item.mnt_rest === 'string')) {
            throw new Error('Invalid data format: Expected an array of objects with mnt_rest property.');
        }

        // Sum the mnt_rest values after converting them to numbers
        const total = data.reduce((sum, item) => sum + parseFloat(item.mnt_rest), 0);

        return total;
    } catch (error) {
        console.error('Error fetching acompte details:', error);
        throw error; // Propagate error to caller
    }
};
