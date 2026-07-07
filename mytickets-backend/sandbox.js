const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 4000; // Using port 4000 for our sandbox drills!
app.use(express.json());
app.use(cors());

// TASK 1: Create a Route Parameter endpoint
// When someone visits GET /api/student/:name/:rollNumber
// It should respond with a JSON object greeting them and showing their roll number.
app.get("/api/student/:name/:rollNumber", (req, res) => {
    const Name = req.params.name;
    const id = req.params.rollNumber;
    res.json({
        greeting: "Hello " + Name + "!",
        rollNumber: "Your rollNumber is " + id
    });
});

// TASK 2: Create a Query String endpoint
// When someone visits GET /api/filter
// It should look for 'category' and 'minPrice' in the URL query strings
// And send back a JSON response echoing what they searched for.
app.get("/api/filter", (req, res) => {
    const Category = req.query.category;
    const min = req.query.minPrice;
    res.json({
        searchCatagory: Category,
        minPrice: min
    });
});

// TASK 3: Create a User Registration Validation Route (POST /api/register)
// Expected incoming req.body: { "username": "...", "email": "...", "age": ... }

app.post("/api/register", (req, res) => {
    // 1. Extract username, email, and age from req.body
    const user = req.body.username;
    const mail = req.body.email;
    const a = req.body.age;

    // 2. VALIDATION RULE 1: If username OR email is missing, 
    //    send back HTTP status 400 (Bad Request) with a clear error message in JSON.
    if (!user || !mail) {
        res.status(400).json({
            message: "Missing of usename or email"
        });
    }

    // 3. VALIDATION RULE 2: If age is strictly less than 18, 
    //    send back HTTP status 400 (Bad Request) explaining they must be 18+.
    else if (a < 18) {
        res.status(400).json({
            message: "User must consist age of 18+"
        });
    }

    // 4. SUCCESS: If all validations pass, send back HTTP status 201 (Created)
    //    along with a success message and the user details!
    else {
        res.status(201).json({
            message: user + "Had created successfully!",
            username: user,
            email: mail,
            age: a
        });
    }
});

// TASK 4: Write a custom middleware function called 'apiKeyGuard'
function apiKeyGuard(req, res, next) {
    // 1. Grab the 'key' from the URL query string (req.query.key)
    const clientKey = req.query.key;

    // 2. Check if the key equals "PERN2026"
    //    - If it DOES equal "PERN2026", call next() so they can proceed to the route!
    //    - If it DOES NOT match (or is missing), block them! 
    //      Send back status 401 (Unauthorized) with a JSON error message: { error: "Invalid API Key!" }
    if (clientKey === "PERN2026") {
        next();
    } else {
        res.status(401).json({ message: "Unauthorized: Invalid API Key!" })
    }

}

// TASK 5: Apply your middleware to protect ONLY this secret route!
app.get("/api/topsecret", apiKeyGuard, (req, res) => {
    res.json({ secretMessage: "Congratulations! You bypassed the middleware security guard!" });
});

app.listen(PORT, () => {
    console.log(`🧪 Sandbox Bootcamp running on http://localhost:${PORT}`);
});