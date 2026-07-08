import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function BookingScreen({ movieTitle, theater, showtime, user, onRequireLogin, onBack }) {
    const ticketPrice = 250;

    // 1. Dynamic state loaded straight from PostgreSQL!
    const [occupiedSeats, setOccupiedSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);

    // 2. Fetch occupied seats whenever we open this screen
    useEffect(() => {
        fetch(`${API_URL}/api/seats?movieTitle=${encodeURIComponent(movieTitle)}&theater=${encodeURIComponent(theater)}&showtime=${encodeURIComponent(showtime)}`)
            .then(res => res.json())
            .then(data => {
                console.log(`💺 Loaded taken seats from PostgreSQL:`, data);
                setOccupiedSeats(data);
            })
            .catch(err => console.error("Error fetching live seats:", err));
    }, [movieTitle, theater, showtime]);

    const handleSeatClick = (seatIndex) => {
        if (occupiedSeats.includes(seatIndex)) return;

        if (selectedSeats.includes(seatIndex)) {
            setSelectedSeats(selectedSeats.filter(seat => seat !== seatIndex));
        } else {
            setSelectedSeats([...selectedSeats, seatIndex]);
        }
    };

    // 🚨 THE NEW STRIPE CHECKOUT FUNCTION
    const handleCheckout = async () => {
        // GATEKEEPER 1: Check if user is logged in
        if (!user) {
            alert("🔒 Please log in or register to complete your ticket reservation!");
            onRequireLogin();
            return;
        }

        // GATEKEEPER 2: Did they select a seat?
        if (selectedSeats.length === 0) {
            alert("Please select at least one seat before proceeding.");
            return;
        }

        const totalCost = selectedSeats.length * ticketPrice;

        try {
            // Ask the backend to create the bill via Stripe
            const response = await fetch(`${API_URL}/api/create-checkout-session`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    movieTitle: movieTitle,
                    totalCost: totalCost
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to connect to checkout service");
            }

            const data = await response.json();

            // The Magic Handoff: If the backend gives us a URL, teleport the user!
            if (data.url) {
                // 👈 ADD THIS: Save the ticket details temporarily before we leave!
                localStorage.setItem("pendingBooking", JSON.stringify({
                    userId: user.id,
                    movieTitle: movieTitle,
                    theater: theater,
                    showtime: showtime,
                    selectedSeats: selectedSeats,
                    totalCost: totalCost
                }));

                window.location.href = data.url;
            } else {
                alert("Stripe session creation failed.");
            }

        } catch (err) {
            console.error("Checkout Error:", err.message);
            alert("Something went wrong preparing your checkout.");
        }
    };

    return (
        <section id="booking-screen" style={{ padding: "40px 5%" }}>
            <h3 style={{ textAlign: "center", color: "#fff", marginBottom: "15px" }}>
                {movieTitle} — {theater} ({showtime})
            </h3>

            <ul className="showcase">
                <li><div className="seat"></div><small>Available</small></li>
                <li><div className="seat selected"></div><small>Selected</small></li>
                <li><div className="seat occupied"></div><small>Occupied</small></li>
            </ul>

            <div className="cinema-container">
                <div className="cinema-screen">SCREEN THIS WAY</div>
                <div className="seat-grid" id="seat-map">
                    {Array.from({ length: 48 }, (_, index) => {
                        const isOccupied = occupiedSeats.includes(index);
                        const isSelected = selectedSeats.includes(index);

                        let seatClass = "seat";
                        if (isOccupied) seatClass += " occupied";
                        if (isSelected) seatClass += " selected";

                        return (
                            <div
                                key={index}
                                className={seatClass}
                                onClick={() => handleSeatClick(index)}
                            ></div>
                        );
                    })}
                </div>
            </div>

            <p className="text" style={{ textAlign: "center", marginTop: "20px" }}>
                You have selected <span id="count" style={{ color: "#e50914", fontWeight: "bold" }}>{selectedSeats.length}</span> seats
                for a price of ₹<span id="total" style={{ color: "#e50914", fontWeight: "bold" }}>{selectedSeats.length * ticketPrice}</span>
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "25px" }}>
                <button onClick={onBack} style={{ background: "transparent", color: "#7f8c8d", border: "1px solid #7f8c8d", padding: "10px 20px", borderRadius: "4px", cursor: "pointer" }}>Back to Theaters</button>

                {/* This button now triggers the Stripe handoff! */}
                <button onClick={handleCheckout} className="btn-book">Proceed to Checkout</button>
            </div>
        </section>
    );
}

export default BookingScreen;