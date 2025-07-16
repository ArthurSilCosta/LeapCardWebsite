 Leap Card System
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21-blue?logo=express)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-5.7+-blue?logo=mysql)](https://www.mysql.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](LICENSE)

A **full-stack registration & login system** for users to claim a **free Leap Card**, built with **Node.js**, **Express**, and **MySQL**.  
The system validates user data, generates a **tracking number**, and provides a **simple login interface** to check card collection status.

---

Table of Contents
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Database Structure](#-database-structure)
- [Endpoints](#-endpoints)
- [Front-End Preview](#-front-end-preview)
- [Future Improvements](#-future-improvements)
- [License](#-license)

---

## Features

 **User Registration** – Validates and stores user data in MySQL  
 **Unique Tracking Number** – Auto-generated per user  
 **Login System** – Search by email or tracking number  
 **Rate Limiting** – Protects against brute-force attempts  
 **Clean Front-End** – Animated HTML/CSS with dynamic form switching  
 **Auto Table Creation** – Creates DB table if it doesn’t exist

---

## Tech Stack

| Layer         | Technology |
|---------------|-----------|
| **Backend**   | Node.js, Express.js |
| **Database**  | MySQL |
| **Security**  | dotenv (env vars), express-rate-limit |
| **Frontend**  | HTML5, CSS3 (animations), Vanilla JS |

---

##  Project Structure

```
📦 leap-card-system
 ┣  app.js               # Simple HTTP server (not used in main app)
 ┣  server.js            # Main Express app with routes
 ┣  database.js          # MySQL connection & table creation
 ┣  index.js             # CSV bulk insert logic (optional)
 ┣  connection.js        # Basic MySQL connection (not used in main flow)
 ┣  form.html            # Front-end form (Sign Up & Login)
 ┣  style.css            # Front-end styling
 ┣  script.js            # Front-end logic (form switching & fetch)
 ┣  package.json         # Dependencies & metadata
 ┗  .env                  # Environment variables (to be created)
```

---

##  Installation

### 1. Clone & Install
```bash
git clone https://github.com/ArthurSilCosta/leap-card-system.git
cd leap-card-system
npm install
```

### 2. Set Up Database
- Create a MySQL database (e.g., `LeapCardDB`).
- Add a user with proper privileges.

### 3. Configure Environment Variables
Create a `.env` file:

```
DB_HOST=localhost
DB_NAME=LeapCardDB
DB_USER=your_user
DB_PASSWORD=your_password
```

### 4. Run the Server
```bash
node server.js
```
Server will run at **http://localhost:3000**

---

## Database Structure

The following table is automatically created:

| Field          | Type          | Description |
|----------------|--------------|-------------|
| `first_name`   | VARCHAR(50)  | User’s first name |
| `last_name`    | VARCHAR(50)  | User’s last name |
| `age`          | INT          | Age (12–120) |
| `email`        | VARCHAR(100) | **Unique** email |
| `phone_number` | VARCHAR(20)  | 10-digit phone number |
| `eircode`      | VARCHAR(10)  | Irish postal code |
| `address`      | VARCHAR(255) | Full address |
| `city`         | VARCHAR(255) | City |
| `country`      | VARCHAR(255) | Country |
| `tracking_number` | INT       | Auto-generated |
| `status`       | VARCHAR(255) | Default: “Collect at CCT College” |

---

## Endpoints

### 1. Register – `POST /register`
#### Request:
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "age": 30,
  "email": "johndoe@example.com",
  "phone_number": "0893216548",
  "eircode": "1YR5DD",
  "address": "123 Main Street",
  "city": "Dublin",
  "country": "Ireland"
}
```
#### Response:
```
Registration successful! Your tracking number is: JOHN12345
```

### 2. Login – `POST /login`
#### Request:
```json
{ "identifier": "johndoe@example.com" }
```
or
```json
{ "identifier": "JOHN12345" }
```
#### Response:
```
You can collect your card at CCT College. Tracking Number: JOHN12345
```

---

##  Front-End Preview

**Sign Up & Login Form:**  
- Tabs toggle between registration and login.  
- Animated buttons & floating background effects.

```md
![Leap Card Form Preview](assets/form-preview.png)
```

*(Upload your own preview screenshot in `assets/` folder)*

---

##  Future Improvements

 Add real authentication (passwords & hashing)  
 Send email with tracking number after registration  
 Build an admin panel to manage users

---

##  License

This project is licensed under the **ISC License** – see the [LICENSE](LICENSE) file for details.
