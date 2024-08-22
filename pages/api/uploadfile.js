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
        const form = new IncomingForm({
            keepExtensions: true, // Preserve file extensions
        });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error('Error parsing files:', err);
                return res.status(500).json({ error: 'Error parsing files' });
            }

            try {
                const facture_id = fields.facture_id ? parseInt(fields.facture_id[0], 10) : null;
                const acompte_id = fields.acompte_id ? parseInt(fields.acompte_id[0], 10) : null;

                // Validate the ids
                if (facture_id && isNaN(facture_id)) {
                    throw new Error('Invalid facture_id');
                }
                if (acompte_id && isNaN(acompte_id)) {
                    throw new Error('Invalid acompte_id');
                }

                // Handle multiple files
                const fileList = Array.isArray(files.file_data) ? files.file_data : [files.file_data];
                const filePromises = fileList.map(async (file) => {
                    if (!file) {
                        throw new Error('No file uploaded');
                    }

                    const filePath = file.filepath;
                    const fileBuffer = await fs.promises.readFile(filePath);
                    const fileName = file.originalFilename; // Access the original file name

                    const connection = await mysql.createConnection({
                        host: 'localhost',
                        database: 'ez',
                        user: 'root',
                        password: '',
                    });

                    // Insert file into database
                    const [result] = await connection.execute(
                        'INSERT INTO files (file_data, facture_id, acompte_id, file_name) VALUES (?, ?, ?, ?)',
                        [fileBuffer, facture_id || null, acompte_id || null, fileName]
                    );

                    await connection.end();

                    // Delete the file from temporary directory
                    await fs.promises.unlink(filePath);

                    return { success: true, fileId: result.insertId };
                });

                // Wait for all file uploads to complete
                const results = await Promise.all(filePromises);

                return res.status(200).json({ results });
            } catch (error) {
                console.error('Error storing file in database:', error);
                return res.status(500).json({ error: 'Failed to store file' });
            }
        });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
