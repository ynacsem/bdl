import mysql from "mysql2/promise";

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { table, id, idField = 'id' } = req.body;

  if (!table || !id) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const dbconnection = await mysql.createConnection({
    host: "localhost",
    database: "ez",
    user: "root",
    password: ""
  });

  try {
    const query = `DELETE FROM ${table} WHERE ${idField} = ?`;

    // Execute the query
    const [result] = await dbconnection.execute(query, [id]);
    dbconnection.end();

    // Send the response
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'No rows deleted' });
    }
    
    res.status(200).json({ message: 'Data deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
