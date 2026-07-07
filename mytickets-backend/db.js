const { Pool } = require("pg");

// 1. Check if we are on Render (Render will provide a DATABASE_URL)
const isProduction = process.env.DATABASE_URL;

// 2. Set up the configuration dynamically
const poolConfig = isProduction
    ? {
        // --- LIVE RENDER CONFIGURATION ---
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false } // Required by Neon
    }
    : {
        // --- LOCAL LAPTOP CONFIGURATION ---
        user: "postgres",
        host: "localhost",
        database: "mytickets_db",
        password: "sai12345",
        port: 5432,
    };

// 3. Create the pool
const pool = new Pool(poolConfig);

// A quick helper query to verify our connection works!
pool.query("SELECT NOW()", (err, res) => {
    if (err) {
        console.error("❌ Database connection failed:", err.message);
    } else {
        console.log("🐘 Successfully connected to PostgreSQL!");
    }
});

// Export the pool
module.exports = pool;