require('dotenv').config(); // Load environment variables from .env

var mysql = require("mysql");

var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});
//check if the database is connected or not
//if connected it will output succesfull message
//if not it will output error message
connection.connect(err => {
    if (err) {
        console.error("Database connection failed. Please check your configuration.");
        process.exit(1); // Exit the process for critical errors
    }
    console.log("Connected to the database sucessfully!.");
});

// Create table if not exists
const createTableQuery = `
CREATE TABLE IF NOT EXISTS mysql_table (
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    age INT,
    email VARCHAR(100),
    phone_number VARCHAR(20),
    eircode VARCHAR(10),
    address VARCHAR(255),
    city VARCHAR(255),
    country VARCHAR(255),
    tracking_number INT,
    status VARCHAR(255)
);
`;

// Execute the create table query
connection.query(createTableQuery, (err, result) => {
if (err) {
    console.error("Error creating table:", err); // log detailed error for debugging
    return;
}
console.log("Table created or already exists.");
});

module.exports = connection;