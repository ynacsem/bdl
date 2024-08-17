import mysql from 'mysql2';

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

export const query = (sql, params) => new Promise((resolve, reject) => {
  pool.query(sql, params, (error, results) => {
    if (error) return reject(error);
    resolve(results);
  });
});
