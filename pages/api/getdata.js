import mysql from "mysql2/promise";

export default async function handler(req, res) {
  const { fields = '*', table = 'frs', filters = '', joins = '' } = req.query;

  const dbconnection = await mysql.createConnection({
    host: "127.0.0.1",
    database: "ez",
    user: "root",
    password: ""
  });

  try {
    let query = `SELECT ${fields} FROM ${table}`;

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

    const [data] = await dbconnection.execute(query);
    dbconnection.end();

    res.status(200).json({ results: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
