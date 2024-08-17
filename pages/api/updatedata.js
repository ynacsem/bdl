import mysql from "mysql2/promise";

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { table, data, id, idField = 'id' } = req.body;

  if (!table || !data || typeof data !== 'object' || !id) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const dbconnection = await mysql.createConnection({
    host: "localhost",
    database: "ez",
    user: "root",
    password: ""
  });

  try {
    // Prepare set clauses
    const setClauses = Object.keys(data)
      .map(key => `${key} = ?`)
      .join(', ');
    const values = Object.values(data);

    const query = `UPDATE ${table} SET ${setClauses} WHERE ${idField} = ?`;

    // Add the id as the last parameter
    values.push(id);

    // Execute the query
    const [result] = await dbconnection.execute(query, values);
    dbconnection.end();

    // Send the response
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'No rows updated' });
    }
    
    res.status(200).json({ message: 'Data updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
