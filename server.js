const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
require('dotenv').config(); 

const app = express();
const PORT = process.env.PORT || 3000; 

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.stack);
        return;
    }
    console.log('Connected to MySQL as ID', connection.threadId);
});

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/submit', (req, res) => {
    const formData = req.body; 

    const sql = 'INSERT INTO users (firstName, lastName, age, gender) VALUES (?, ?, ?, ?)';
    const values = [formData.firstName, formData.lastName, formData.age, formData.gender];

    connection.query(sql, values, (error, results, fields) => {
        if (error) {
            console.error('Error inserting into MySQL:', error);
            return res.status(500).json({ message: 'Error submitting form' });
        }
        console.log('Inserted ID:', results.insertId);
        res.json({ message: 'Form submitted successfully!', data: formData });
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
