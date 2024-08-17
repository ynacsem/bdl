import { IncomingForm } from 'formidable';
import mysql from 'mysql2/promise';
import fs from 'fs';

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const form = new IncomingForm();

        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error('Error parsing files:', err);
                return res.status(500).json({ error: 'Error parsing files' });
            }

            try {
                const facture_id = parseInt(fields.facture_id[0], 10); // Convert to integer
                console.log('Facture ID:', facture_id);
                if (isNaN(facture_id)) {
                    throw new Error('Invalid facture_id');
                }

                const file = files.file_data;
                console.log('File:', file);
                if (!file || file.length === 0) {
                    throw new Error('No file uploaded');
                }

                const fileBuffer = await fs.promises.readFile(file[0].filepath); // Access the file
                
                const connection = await mysql.createConnection({
                    host: 'localhost',
                    database: 'ez',
                    user: 'root',
                    password: '',
                });

                const [result] = await connection.execute(
                    'INSERT INTO files (file_data, facture_id) VALUES (?, ?)',
                    [fileBuffer, facture_id]
                );

                await connection.end();

                return res.status(200).json({ success: true, fileId: result.insertId });
            } catch (error) {
                console.error('Error storing file in database:', error);
                return res.status(500).json({ error: 'Failed to store file' });
            }
        });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
