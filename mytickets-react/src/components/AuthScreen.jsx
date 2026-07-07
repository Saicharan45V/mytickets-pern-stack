import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function AuthScreen({ onLoginSuccess, onBack }) {
    const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Register
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const endpoint = isLogin ? "/api/login" : "/api/register";
        const payload = isLogin ? { email, password } : { username, email, password };

        try {
            const res = await fetch(`${API_URL}${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (res.ok) {
                alert(`🎉 Welcome, ${data.user.username}!`);
                onLoginSuccess(data.user);
            } else {
                setError(data.error || "Authentication failed");
            }
        } catch (err) {
            setError("Server connection failed. Is Node running?");
        }
    };

    return (
        <section style={{ padding: "60px 20px", maxWidth: "400px", margin: "0 auto", color: "#fff" }}>
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
                {isLogin ? "🔑 Welcome Back" : "✨ Create Account"}
            </h2>

            {error && <p style={{ backgroundColor: "#e50914", padding: "10px", borderRadius: "4px", textAlign: "center" }}>{error}</p>}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                {!isLogin && (
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={{ padding: "12px", borderRadius: "4px", border: "1px solid #444", background: "#222", color: "#fff" }}
                    />
                )}
                <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ padding: "12px", borderRadius: "4px", border: "1px solid #444", background: "#222", color: "#fff" }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ padding: "12px", borderRadius: "4px", border: "1px solid #444", background: "#222", color: "#fff" }}
                />

                <button type="submit" className="btn-book" style={{ width: "100%", padding: "12px", marginTop: "10px" }}>
                    {isLogin ? "Log In" : "Register"}
                </button>
            </form>

            <p style={{ textAlign: "center", marginTop: "20px", color: "#aaa" }}>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <span
                    onClick={() => setIsLogin(!isLogin)}
                    style={{ color: "#e50914", cursor: "pointer", fontWeight: "bold" }}
                >
                    {isLogin ? "Register here" : "Log in"}
                </span>
            </p>

            <div style={{ textAlign: "center", marginTop: "30px" }}>
                <button onClick={onBack} style={{ background: "none", border: "none", color: "#7f8c8d", cursor: "pointer" }}>
                    ← Back to Catalog
                </button>
            </div>
        </section>
    );
}

export default AuthScreen;