import mysql from 'mysql2';

// Create a connection to the database
const connection = mysql.createConnection({
  host: '127.0.0.1', // Your database host
  user: 'root',      // Your database user
  password: '', // Your database password
  database: 'bdl'    // Your database name
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + connection.threadId);
});

export default connection;
