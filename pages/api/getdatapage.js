import mysql from 'mysql2/promise';

export default async function handler(req, res) {
    const { fields = '*', table = 'facture', filters = '', order = '', limit = 10, offset = 0,joins=''} = req.query;

    const dbconnection = await mysql.createConnection({
        host: "localhost",
        database: "ez",
        user: "root",
        password: ""
    });

    try {
        let query = `SELECT ${fields} FROM ${table}`;
        let countQuery = `SELECT COUNT(*) AS totalCount FROM ${table}`;
        if (joins) {
            const joinConditions = joins.split(',').map(join => join.trim());
            query += ` ${joinConditions.join(' ')}`;
          }
        if (filters) {
            const filterConditions = filters.split(',').map(filter => filter.trim()).filter(Boolean);
            if (filterConditions.length > 0) {
                query += ` WHERE ${filterConditions.join(' AND ')}`;
                countQuery += ` WHERE ${filterConditions.join(' AND ')}`;
            }
        }

        if (order) {
            query += ` ORDER BY ${order} DESC`;
        }

        if (limit) {
            query += ` LIMIT ${parseInt(limit, 10)}`;
        }

        if (offset) {
            query += ` OFFSET ${parseInt(offset, 10)}`;
        }

        const [data] = await dbconnection.execute(query);
        const [[{ totalCount }]] = await dbconnection.execute(countQuery);

        dbconnection.end();
        res.status(200).json({ results: data, totalCount });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
