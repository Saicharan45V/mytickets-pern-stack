import { useEffect, useState, useRef } from 'react';

const API_URL = import.meta.env.VITE_API_URL || "https://mytickets-pern-stack.onrender.com";

function SuccessScreen({ onNavigate }) {
    const [status, setStatus] = useState("Saving your ticket...");
    const hasSaved = useRef(false); // Prevents React from saving it twice

    useEffect(() => {
        const finalizeBooking = async () => {
            if (hasSaved.current) return;
            hasSaved.current = true;

            // 1. Grab the ticket from browser memory
            const pendingBooking = localStorage.getItem("pendingBooking");

            if (!pendingBooking) {
                setStatus("No pending booking found. Did you already save this?");
                return;
            }

            const bookingData = JSON.parse(pendingBooking);

            try {
                // 2. Send it to your existing database route!
                const response = await fetch(`${API_URL}/api/bookings`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(bookingData)
                });

                if (response.ok) {
                    setStatus("🎉 Payment Successful! Ticket booked in database.");
                    // 3. Clear the memory so we don't accidentally book it again later
                    localStorage.removeItem("pendingBooking");
                } else {
                    setStatus("Payment succeeded, but database save failed. Contact support.");
                }
            } catch (err) {
                console.error(err);
                setStatus("Network error while saving ticket.");
            }
        };

        finalizeBooking();
    }, []);

    return (
        <div style={{ textAlign: "center", padding: "100px 20px", color: "white" }}>
            <h1 style={{ fontSize: "3rem", color: "#2ecc71", marginBottom: "20px" }}>✓</h1>
            <h2>{status}</h2>
            <p style={{ color: "#aaa", marginTop: "15px", marginBottom: "30px" }}>
                A receipt has been sent to your email by Stripe.
            </p>
            <button
                onClick={() => onNavigate('dashboard')}
                className="btn-book"
                style={{ fontSize: "1.1rem", padding: "12px 24px" }}
            >
                View My Tickets
            </button>
        </div>
    );
}

export default SuccessScreen;