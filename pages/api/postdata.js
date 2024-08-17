import mysql from "mysql2/promise";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { table, data } = req.body;

  if (!table || !data || typeof data !== 'object') {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const dbconnection = await mysql.createConnection({
    host: "localhost",
    database: "ez",
    user: "root",
    password: ""
  });

  try {
    // Prepare column names and values
    const columns = Object.keys(data).join(', ');
    const values = Object.values(data);
    const placeholders = values.map(() => '?').join(', ');

    const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;

    // Execute the query
    const [result] = await dbconnection.execute(query, values);
    dbconnection.end();

    // Extract the inserted ID from the result
    const insertedId = result.insertId;

    // Send the response with the inserted ID
    res.status(200).json({ message: 'Data inserted successfully', id: insertedId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
