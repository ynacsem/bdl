import mysql from 'mysql2/promise';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { facture_id, acompte_id } = req.query;

        // Check if neither facture_id nor acompte_id is provided
        if (!facture_id && !acompte_id) {
            return res.status(400).json({ error: 'Missing facture_id or acompte_id' });
        }

        try {
            const connection = await mysql.createConnection({
                host: 'localhost',
                database: 'ez',
                user: 'root',
                password: ''
            });

            let query = 'SELECT id, file_data, file_name FROM files WHERE ';
            const queryParams = [];

            if (facture_id) {
                query += 'facture_id = ?';
                queryParams.push(facture_id);
            } else if (acompte_id) {
                query += 'acompte_id = ?';
                queryParams.push(acompte_id);
            }

            const [rows] = await connection.execute(query, queryParams);
            await connection.end();

            if (rows.length === 0) {
                return res.status(404).json({ error: 'No files found' });
            }

            return res.status(200).json(rows);
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
