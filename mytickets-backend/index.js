const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

const movies = [
    { id: 1, title: "Interstellar", genre: "Sci-Fi / Drama", image: "Screenshot 2026-06-30 123103.png", screen: "intrstellar-screen.jpg" },
    { id: 2, title: "Gone Girl", genre: "Thriller / Mystery", image: "Screenshot 2026-06-30 123852.png", screen: "gonegirl-screen.jpg" },
    { id: 3, title: "Shutter Island", genre: "Horror / Mystery", image: "Screenshot 2026-06-30 124120.png", screen: "shutterIsland-screen.jpg" },
    { id: 4, title: "American Psycho", genre: "Horror / Comedy", image: "AmericanPhysco.jpg", screen: "AmericanPhysco-screen.jpg" }
];

// --- AUTHENTICATION ROUTES ---

// 1. Register a new user account
app.post("/api/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ error: "Please fill in all fields!" });
        }

        const newUser = await pool.query(
            "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email",
            [username, email, password]
        );

        console.log("👤 NEW USER REGISTERED:", newUser.rows[0]);
        res.status(201).json({ success: true, user: newUser.rows[0] });
    } catch (err) {
        if (err.code === "23505") { // PostgreSQL unique constraint violation code
            return res.status(400).json({ error: "Email already exists! Please log in." });
        }
        console.error("Register Error:", err.message);
        res.status(500).json({ error: "Registration failed." });
    }
});

// 2. Log in to an existing account
app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await pool.query("SELECT * FROM users WHERE email = $1 AND password = $2", [email, password]);

        if (user.rows.length === 0) {
            return res.status(401).json({ error: "Invalid email or password!" });
        }

        console.log("🔑 USER LOGGED IN:", user.rows[0].username);
        res.json({
            success: true,
            user: { id: user.rows[0].id, username: user.rows[0].username, email: user.rows[0].email }
        });
    } catch (err) {
        console.error("Login Error:", err.message);
        res.status(500).json({ error: "Login failed." });
    }
});

// --- MOVIE & SEAT ROUTES ---

app.get("/api/movies", (req, res) => {
    res.json(movies);
});

app.get("/api/seats", async (req, res) => {
    try {
        const { movieTitle, theater, showtime } = req.query;
        const result = await pool.query(
            "SELECT booked_seats FROM bookings WHERE movie_title = $1 AND theater = $2 AND showtime = $3",
            [movieTitle, theater, showtime]
        );

        let takenSeats = [];
        result.rows.forEach(row => {
            if (row.booked_seats) takenSeats.push(...row.booked_seats);
        });
        res.json(takenSeats);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch seats" });
    }
});

// Save booking NOW REQUIRED to include user_id!
app.post("/api/bookings", async (req, res) => {
    try {
        const { userId, movieTitle, theater, showtime, selectedSeats, totalCost } = req.body;

        if (!userId || !movieTitle || !theater || !showtime || !selectedSeats || selectedSeats.length === 0) {
            return res.status(400).json({ error: "Missing booking details or user ID!" });
        }

        const newBooking = await pool.query(
            "INSERT INTO bookings (user_id, movie_title, theater, showtime, booked_seats, total_cost) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [userId, movieTitle, theater, showtime, selectedSeats, totalCost]
        );

        console.log("🐘 TICKET BOOKED BY USER ID", userId, ":", newBooking.rows[0]);
        res.status(201).json({ success: true, message: "Ticket booked successfully!", bookingDetails: newBooking.rows[0] });
    } catch (err) {
        console.error("Booking Error:", err.message);
        res.status(500).json({ error: "Failed to save booking" });
    }
});

// Get personalized booking history for a specific logged-in user
app.get("/api/my-bookings/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const userBookings = await pool.query(
            "SELECT * FROM bookings WHERE user_id = $1 ORDER BY id DESC",
            [userId]
        );
        res.json(userBookings.rows);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch booking history" });
    }
});

app.listen(5000, () => console.log(`🚀 PERN Server with Auth running on port 5000`));