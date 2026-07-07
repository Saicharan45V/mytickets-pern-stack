import { useState } from "react";

function MovieReview({ title, releaseYear }) {
    const [likes, setLikes] = useState(0);
    const [hasWatched, setHasWatched] = useState(false);

    // NEW: State to store the user's star rating (0 to 5)
    const [userRating, setUserRating] = useState(0);

    return (
        <div style={{ background: "#1f1f1f", padding: "20px", borderRadius: "8px", margin: "20px 0", border: "1px solid #333" }}>
            <h3 style={{ color: "#fff", marginBottom: "12px" }}>{title} ({releaseYear})</h3>

            {/* 1. Watch Status Button */}
            <button
                onClick={() => setHasWatched(!hasWatched)}
                style={{ padding: "8px 14px", cursor: "pointer", borderRadius: "4px", border: "none", fontWeight: "bold" }}
            >
                {hasWatched ? "Watched ✅" : "Mark as Watched ❌"}
            </button>

            {/* 2. Rating & Review Section (ONLY visible if watched is true) */}
            {hasWatched && (
                <div style={{ marginTop: "15px", borderTop: "1px solid #333", paddingTop: "15px" }}>
                    <p style={{ color: "#2ecc71", marginBottom: "10px", fontWeight: "500" }}>
                        Hope you enjoyed the show! Rate your experience:
                    </p>

                    {/* NEW: 5-Star Interactive Grid */}
                    <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "15px" }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => setUserRating(star)}
                                style={{
                                    background: "none",
                                    border: "none",
                                    fontSize: "26px",
                                    cursor: "pointer",
                                    transition: "color 0.2s",
                                    // If star number is <= userRating, color it gold! Otherwise, dark grey.
                                    color: star <= userRating ? "#f1c40f" : "#444"
                                }}
                            >
                                ★
                            </button>
                        ))}

                        {/* Dynamic rating readout */}
                        {userRating > 0 && (
                            <span style={{ color: "#aaa", marginLeft: "10px", fontSize: "14px" }}>
                                ({userRating}/5 Stars)
                            </span>
                        )}
                    </div>

                    {/* Like Button */}
                    <button
                        onClick={() => setLikes(likes + 1)}
                        style={{ background: "#e50914", color: "#fff", padding: "8px 14px", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
                    >
                        👍 Like ({likes})
                    </button>
                </div>
            )}
        </div>
    );
}

export default MovieReview;