const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require("express");
const cors = require("cors");
const pool = require("./db");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

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
            user: { id: user.rows[0].id, username: user.rows[0].username, email: user.rows[0].email, is_admin: user.rows[0].is_admin }
        });
    } catch (err) {
        console.error("Login Error:", err.message);
        res.status(500).json({ error: "Login failed." });
    }
});

// --- MOVIE & SEAT ROUTES ---

app.get("/api/movies", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM movies ORDER BY id ASC");
        res.json(result.rows);
    } catch (err) {
        // 🚨 This sends the EXACT PostgreSQL error to your browser!
        res.status(500).json({ error: "Failed to fetch movies", details: err.message });
    }
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

// --- ADMIN ROUTES ---

// The Middleware Bouncer
const isAdmin = async (req, res, next) => {
    try {
        const userId = req.headers.userid; // We will send this from React

        if (!userId) {
            return res.status(403).json({ error: "No User ID provided" });
        }

        // Check if this specific user has is_admin set to true in the database
        const user = await pool.query("SELECT is_admin FROM users WHERE id = $1", [userId]);

        if (user.rows[0] && user.rows[0].is_admin === true) {
            next(); // They are an admin, let them through!
        } else {
            res.status(403).json({ error: "Access Denied. Admins only." });
        }
    } catch (err) {
        console.error("Admin Check Error:", err.message);
        res.status(500).json({ error: "Server error checking admin status" });
    }
};

// The Protected Route (Notice we pass 'isAdmin' as the middle argument)
app.get("/api/admin/all-bookings", isAdmin, async (req, res) => {
    try {
        // Fetch every booking in the database, newest first
        const allBookings = await pool.query("SELECT * FROM bookings ORDER BY booked_at DESC");
        res.json(allBookings.rows);
    } catch (err) {
        console.error("Admin Fetch Error:", err.message);
        res.status(500).json({ error: "Failed to fetch all bookings" });
    }
});

// Admin: Add a new movie
app.post("/api/admin/movies", isAdmin, async (req, res) => {
    try {
        const { title, genre, image, screen } = req.body;
        const newMovie = await pool.query(
            "INSERT INTO movies (title, genre, image, screen) VALUES ($1, $2, $3, $4) RETURNING *",
            [title, genre, image, screen]
        );
        res.status(201).json(newMovie.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Failed to add movie" });
    }
});

// Admin: Delete a movie
app.delete("/api/admin/movies/:id", isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM movies WHERE id = $1", [id]);
        res.json({ message: "Movie deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete movie" });
    }
});

app.post("/api/create-checkout-session", async (req, res) => {
    try {
        // 1. Extract the booking details sent from React
        const { movieTitle, totalCost } = req.body;

        // 2. Automatically detect if we are on localhost or live Vercel
        const frontendURL = req.headers.origin || "http://localhost:5173";

        // 3. Create the Stripe Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: [
                {
                    price_data: {
                        currency: "inr", // 🇮🇳 Indian Rupees
                        product_data: {
                            name: `${movieTitle} Ticket(s)`, // What shows up on the receipt
                        },
                        // 🚨 Stripe requires the smallest currency unit (paise). 
                        // Multiply by 100 to convert Rupees to Paise!
                        unit_amount: totalCost * 100,
                    },
                    quantity: 1, // We bundle the total cost into 1 item
                },
            ],
            // 4. Where to send the user after Stripe is done
            success_url: `${frontendURL}/success`, // We will build this React page next!
            cancel_url: `${frontendURL}/`,         // Send back to home if they click back
        });

        // 5. Send the secure Stripe checkout URL back to React
        res.json({ url: session.url });

    } catch (err) {
        console.error("Stripe Error:", err.message);
        res.status(500).json({ error: "Failed to create checkout session" });
    }

});

app.listen(5000, () => console.log(`🚀 PERN Server with Auth running on port 5000`));