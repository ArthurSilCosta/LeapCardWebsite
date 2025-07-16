const mysql = require('mysql2');

// Create a connection to the MySQL database
const connection = mysql.createConnection({
    host: 'localhost',      // Replace with your MySQL server's host
    user: 'postal_user',  // Replace with your MySQL username
    password: 'Postal', // Replace with your MySQL password
    database: 'PostalDB'  // Replace with your database name
});

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        return;
    }
    console.log('Connected to the MySQL database!');
});

// Close the connection when done
connection.end();
