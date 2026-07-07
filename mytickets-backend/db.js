const { Pool } = require("pg");

// A "Pool" manages multiple open database connections automatically
const pool = new Pool({
    user: "postgres",          // Default PostgreSQL superuser
    host: "localhost",         // Hosting on your local machine
    database: "mytickets_db",  // The database we created earlier!
    password: "sai12345", // ⚠️ REPLACE THIS with the exact password you set during installation!
    port: 5432,                // Default PostgreSQL port
});


// A quick helper query to verify our connection works!
pool.query("SELECT NOW()", (err, res) => {
    if (err) {
        console.error("❌ Database connection failed:", err.message);
    } else {
        console.log("🐘 Successfully connected to PostgreSQL at:", res.rows[0].now);
    }
});

// Export the pool so index.js can use it to run SQL queries
module.exports = pool;