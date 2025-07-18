// db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'db_user',
    password: '1234', // ⚠️ Hier dein Passwort eintragen!
    database: 'spruchsammlung_db',   // ✅ Angepasst!
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = { pool };
