import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function MyBookingsScreen({ user, onBack }) {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        fetch(`${API_URL}/api/my-bookings/${user.id}`)
            .then(res => res.json())
            .then(data => {
                setBookings(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching bookings:", err);
                setLoading(false);
            });
    }, [user]);

    return (
        <section style={{ padding: "40px 5%", color: "#fff", maxWidth: "900px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                <h2>🎟️ {user?.username}'s Ticket Wallet</h2>
                <button onClick={onBack} style={{ background: "transparent", border: "1px solid #7f8c8d", color: "#7f8c8d", padding: "8px 16px", borderRadius: "4px", cursor: "pointer" }}>
                    Back to Movies
                </button>
            </div>

            {loading ? (
                <p>Loading your tickets...</p>
            ) : bookings.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px", background: "#1a1a1a", borderRadius: "8px" }}>
                    <p style={{ fontSize: "1.2rem", color: "#aaa" }}>No bookings found yet!</p>
                    <button onClick={onBack} className="btn-book" style={{ marginTop: "15px" }}>Browse Movies</button>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    {bookings.map((ticket) => (
                        <div key={ticket.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#1f1f1f", padding: "20px", borderRadius: "8px", borderLeft: "5px solid #e50914" }}>
                            <div>
                                <h3 style={{ margin: "0 0 5px 0", fontSize: "1.3rem" }}>{ticket.movie_title}</h3>
                                <p style={{ margin: 0, color: "#aaa", fontSize: "0.95rem" }}>📍 {ticket.theater} | 🕒 {ticket.showtime}</p>
                                <p style={{ margin: "10px 0 0 0", fontSize: "0.9rem", color: "#fff" }}>
                                    <strong>Seats ({ticket.booked_seats?.length || 0}):</strong> {ticket.booked_seats?.join(", ")}
                                </p>
                            </div>
                            <div style={{ textAlign: "right" }}>
                                <span style={{ fontSize: "1.4rem", fontWeight: "bold", color: "#2ecc71" }}>₹{ticket.total_cost}</span>
                                <p style={{ margin: "5px 0 0 0", fontSize: "0.75rem", color: "#666" }}>
                                    Booked on {new Date(ticket.booked_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

export default MyBookingsScreen;