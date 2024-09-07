import mysql from 'mysql2/promise';

// Create a pool for connections
const pool = mysql.createPool({
  host: '127.0.0.1',
  database: 'ez',
  user: 'root',
  password: '',
  waitForConnections: true,
  connectionLimit: 10,  // Adjust based on your application's needs
  queueLimit: 0
});

export default async function handler(req, res) {
  const { fields = '*', table = 'frs', filters = '', joins = '' } = req.query;

  let query = `SELECT ${fields} FROM ${table}`;
  const queryParams = [];

  // Handling joins
  if (joins) {
    const joinConditions = joins.split(',').map(join => join.trim());
    query += ` ${joinConditions.join(' ')}`;
  }

  // Handling filters (WHERE conditions)
  if (filters) {
    const filterConditions = filters.split(',').map(filter => filter.trim());
    query += ` WHERE ${filterConditions.join(' AND ')}`;
  }

  try {
    const [data] = await pool.execute(query, queryParams);
    res.status(200).json({ results: data });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
}