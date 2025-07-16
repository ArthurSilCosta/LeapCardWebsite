const express = require("express"); // Import Express for creating the web server
const bodyParser = require("body-parser"); // Middleware for parsing HTTP request bodies
const connection = require("./database"); // Import the database connection
const path = require("path"); 

const app = express(); // Initialize the Express application
const PORT = 3000; // Define the port number for the server

// Middleware to parse URL-encoded data (used for form submissions)
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to parse JSON data in requests
app.use(express.json());

// Serve static files from the "public" directory (e.g., HTML, CSS, JS)
app.use(express.static("public"));

// Middleware for handling errors globally
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack trace
    res.status(500).send("Something went wrong. Please try again later."); // Send a generic error message to the client
});

// Route to serve the main HTML form
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "form.html")); // Send the form HTML file to the client
});

app.post("/register", (req, res, next) => {
    const { first_name, last_name, age, email, phone_number, eircode, address, city, country } = req.body;

    console.log("Received registration data:", req.body);

    if (!first_name || !last_name || !age || !email || !phone_number || !eircode || !address || !city || !country) {
        console.error("Validation error: Missing required fields.");
        return res.status(400).send("All fields are required for registration.");
    }

    // Check if the user already exists in the database
    connection.query(
        "SELECT * FROM mysql_table WHERE email = ?", // Query to find a user by email
        [email], // Parameterized query to avoid SQL injection
        (err, results) => {
            if (err) {
                return next(err); // Pass the error to the error-handling middleware
            }

            // If the user exists, notify them that they've already registered
            if (results.length > 0) {
                return res.send("You already collected your reward.");
            }

            // Generate a tracking number based on the email and current timestamp
            const timestamp = Date.now().toString(); // Get the current timestamp
            const tracking_number = `${email.split("@")[0].slice(0, 5).toUpperCase()}${timestamp.slice(-5)}`; // Generate tracking number
            const status = "Please collect your reward at CCT College"; // Default reward status

            // SQL query to insert the user's information into the database
            const query = `INSERT INTO mysql_table 
                (first_name, last_name, age, email, phone_number, eircode, address, city, country, tracking_number, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            const values = [
                first_name, last_name, age, email, phone_number, eircode, address, city, country, tracking_number, status,
            ]; // Array of values to insert

            // Execute the query
            connection.query(query, values, (err, results) => {
                if (err) {
                    console.error("Database INSERT error:", err.sqlMessage || err.message);
                    return next(err);
                }
            
                console.log("Registration successful. Inserted ID:", results.insertId);
                res.send(`Registration successful! Your tracking number is: ${tracking_number}`);
            });
            
        }
    );
});

const rateLimit = require("express-rate-limit");

// Create a rate limiter
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login attempts per window
    message: "Too many login attempts. Please try again later.",
});

app.post("/login", (req, res) => {
    const { identifier } = req.body; // Extract the identifier (email or tracking number) from the request

    // SQL query to find a user by email or tracking number
    const query = `
        SELECT * FROM mysql_table 
        WHERE email = ? OR tracking_number = ?`;

    // Execute the query with the provided identifier
    connection.query(query, [identifier, identifier], (err, results) => {
        if (err) {
            console.error("Error querying the database:", err); // Log the error
            return res.status(500).json({ error: "Internal server error" }); // Respond with a 500 status code
        }

        // If a user is found, send a success message with their tracking number
        if (results.length > 0) {
            return res.send(`You can collect your card at CCT College. Tracking Number: ${results[0].tracking_number}`);
        } else {
            // If no user is found, prompt them to register
            return res.send("Invalid user, please sign up for the free leap card.");
        }
    });
});

app.listen(PORT, (err) => {
    if (err) {
        if (err.code === "EADDRINUSE") {
            console.error(`Port ${PORT} is already in use. Please close the application using this port or use a different port.`);
        } else {
            console.error("An error occurred while starting the server:", err.message);
        }
        process.exit(1); // Exit the process if the server fails to start
    } else {
        console.log(`Server running at http://localhost:${PORT}`); // Log the server URL
    }
});
