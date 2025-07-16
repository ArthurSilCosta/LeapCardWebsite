const connection = require("./database"); // Import database connection
const csvData = `John Doe,30,johndoe@example.com,0893216548,1YR5DD,123 Main Street,Dublin,Ireland,ABC123,Adult LC
Jane Smith,25,janesmith@example.com,0892856548,8MH7WE,456 Elm Street,Cork,Ireland,DEF456,Student/Young LC
Michael Johnson,40,michaeljohnson@example.com,0898523694,7RP0RR,789 Oak Avenue,Galway,Ireland,GHI789,Adult LC
Tommy Bean,35,tommybean@example.com,0894859612,EYR5DD,321 Pine Lane,Limerick,Ireland,JKL012,Adult LC`;

// Function to validate individual records from the CSV data
function validateRecord(record) {
    const [name, age, email, phone, eircode] = record.split(",").map(item => item.trim());

    // Check if any fields are missing
    if (!name || !age || !email || !phone || !eircode) {
        console.error("Validation failed: Missing fields in record:", record);
        return false;
    }

    // Validate name format (letters and spaces only)
    if (!/^[A-Za-z\s]+$/.test(name)) {
        console.error("Validation failed: Invalid name format in record:", record);
        return false;
    }

    // Validate age (should be a number between 12 and 120)
    if (!/^\d+$/.test(age) || age < 12 || age > 120) {
        console.error("Validation failed: Age must be an integer between 12 and 120 in record:", record);
        return false;
    }

    // Validate email format
    if (!/\S+@\S+\.\S+/.test(email)) {
        console.error("Validation failed: Invalid email format in record:", record);
        return false;
    }

    // Validate phone number (10 digits, optionally starting with '+')
    if (!/^\+?\d{10}$/.test(phone)) {
        console.error("Validation failed: Invalid phone number in record:", record);
        return false;
    }

    // Validate eircode format (6 alphanumeric characters)
    if (!/^[A-Za-z0-9]{6}$/.test(eircode)) {
        console.error("Validation failed: Invalid eircode format in record:", record);
        return false;
    }

    console.log("Validation successful for record:", record); // Confirm validation success
    return true;
}

// Process the CSV data and separate valid and invalid records
function processCSVData() {
    const records = csvData.split("\n").map(record => record.trim()); // Clean up each record
    const validRecords = [];
    const invalidRecords = [];

    console.log("Received CSV data:\n", csvData); // Log the original data

    // Validate each record and classify it as valid or invalid
    records.forEach((record, index) => {
        if (validateRecord(record)) {
            validRecords.push(record.split(",").map(field => field.trim())); // Add valid record
        } else {
            invalidRecords.push({ index, record }); // Keep track of invalid record
        }
    });

    // Log invalid records, if any
    if (invalidRecords.length > 0) {
        console.error("Invalid records found:");
        invalidRecords.forEach(({ index, record }) => console.error(`Record ${index}: ${record}`));
    } else {
        console.log("All records are valid.");
    }

    // Insert valid records into the database, if any
    if (validRecords.length > 0) {
        console.log("Inserting valid records into the database...");
        insertIntoDatabase(validRecords);
    } else {
        console.log("No valid records to insert.");
    }
}

// Function to insert validated records into the database
function insertIntoDatabase(records) {
    const query = `
        INSERT INTO mysql_table 
        (first_name, last_name, age, email, phone_number, eircode) 
        VALUES ?`;

    // Prepare the data for insertion
    const values = records.map(record => {
        const [name, age, email, phone, eircode] = record;
        const [firstName, lastName] = name.trim().split(" ");
        return [firstName, lastName, parseInt(age), email.trim(), phone.trim(), eircode.trim()];
    });

    console.log("Prepared values for insertion:", values); // Log the prepared values

    connection.query(query, [values], (err, results) => {
        if (err) {
            console.error("Error inserting data into the database:", err); // Log errors during insertion
            return;
        }
        console.log(`Successfully inserted ${results.affectedRows} records into the database.`); // Confirm success
    });
}
