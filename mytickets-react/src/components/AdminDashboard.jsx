import { useState, useEffect } from 'react';

// 1. Receive the 'user' prop from App.jsx!
export default function AdminDashboard({ user }) {
    const [newMovie, setNewMovie] = useState({ title: "", genre: "", image: "", screen: "" });
    const [dbMovies, setDbMovies] = useState([]);
    const [allBookings, setAllBookings] = useState([]);
    const [error, setError] = useState("");

    // 2. Use your live Render URL so it works on Vercel
    const API_URL = "https://mytickets-pern-stack.onrender.com";

    useEffect(() => {
        // 3. Grab the ID directly from the passed user state
        const userId = user?.id;

        fetch(`${API_URL}/api/admin/all-bookings`, {
            method: 'GET',
            headers: {
                'userid': userId // Showing the bouncer our ID
            }
        })
            .then(res => {
                if (!res.ok) throw new Error("Not authorized. Admins only.");
                return res.json();
            })
            .then(data => setAllBookings(data))
            .catch(err => setError(err.message));

        fetch(`${API_URL}/api/movies`)
            .then(res => res.json())
            .then(data => setDbMovies(data));
    }, [user]);

    // Handle typing in the form fields
    const handleInputChange = (e) => {
        setNewMovie({ ...newMovie, [e.target.name]: e.target.value });
    };

    // Handle submitting the new movie
    const handleAddMovie = async (e) => {
        e.preventDefault();
        const userId = user?.id;

        try {
            const response = await fetch(`${API_URL}/api/admin/movies`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'userid': userId
                },
                body: JSON.stringify(newMovie)
            });

            if (!response.ok) throw new Error("Failed to add movie");

            const addedMovie = await response.json();

            // Add the new movie to the screen immediately without refreshing
            setDbMovies([...dbMovies, addedMovie]);

            // Clear the form fields back to empty
            setNewMovie({ title: "", genre: "", image: "", screen: "" });

            alert("✅ Movie added successfully!");

        } catch (err) {
            console.error(err);
            alert("Error adding movie. Check the console.");
        }
    };

    // The Delete Function
    const handleDeleteMovie = async (movieId) => {
        const userId = user?.id;
        await fetch(`${API_URL}/api/admin/movies/${movieId}`, {
            method: 'DELETE',
            headers: { 'userid': userId }
        });
        // Remove it from the screen immediately
        setDbMovies(dbMovies.filter(m => m.id !== movieId));
    };

    // Calculate total revenue from all bookings
    const totalRevenue = allBookings.reduce((sum, booking) => sum + booking.total_cost, 0);

    if (error) return <h2 style={{ color: 'red', textAlign: 'center', marginTop: '50px' }}>🚨 {error}</h2>;

    return (
        <div style={{ backgroundColor: '#111', color: '#fff', minHeight: '100vh', padding: '40px' }}>
            <h1 style={{ borderBottom: '2px solid red', paddingBottom: '10px' }}>Admin Command Center</h1>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                <div style={{ backgroundColor: '#222', padding: '20px', borderRadius: '8px', width: '200px' }}>
                    <h3>Tickets Sold</h3>
                    <p style={{ fontSize: '24px', color: 'red', fontWeight: 'bold' }}>{allBookings.length}</p>
                </div>
                <div style={{ backgroundColor: '#222', padding: '20px', borderRadius: '8px', width: '200px' }}>
                    <h3>Total Revenue</h3>
                    <p style={{ fontSize: '24px', color: '#00ff88', fontWeight: 'bold' }}>₹{totalRevenue}</p>
                </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                    <tr style={{ backgroundColor: '#333' }}>
                        <th style={{ padding: '12px' }}>ID</th>
                        <th style={{ padding: '12px' }}>Movie</th>
                        <th style={{ padding: '12px' }}>Theater</th>
                        <th style={{ padding: '12px' }}>User ID</th>
                        <th style={{ padding: '12px' }}>Cost</th>
                        <th style={{ padding: '12px' }}>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {allBookings.map(booking => (
                        <tr key={booking.id} style={{ borderBottom: '1px solid #333' }}>
                            <td style={{ padding: '12px' }}>#{booking.id}</td>
                            <td style={{ padding: '12px' }}>{booking.movie_title}</td>
                            <td style={{ padding: '12px' }}>{booking.theater}</td>
                            <td style={{ padding: '12px' }}>User {booking.user_id}</td>
                            <td style={{ padding: '12px', color: '#00ff88' }}>₹{booking.total_cost}</td>
                            <td style={{ padding: '12px' }}>{new Date(booking.booked_at).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={{ backgroundColor: '#222', padding: '20px', marginTop: '30px', borderRadius: '8px' }}>
                <h2 style={{ borderBottom: '1px solid #444', paddingBottom: '10px' }}>Manage Movies</h2>

                {/* List of Current Movies */}
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {dbMovies.map(movie => (
                        <li key={movie.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #333' }}>
                            <span>{movie.title} ({movie.genre})</span>
                            <button
                                onClick={() => handleDeleteMovie(movie.id)}
                                style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div style={{ backgroundColor: '#222', padding: '20px', marginTop: '30px', borderRadius: '8px' }}>
                <h2 style={{ borderBottom: '1px solid #444', paddingBottom: '10px' }}>Add New Movie</h2>

                <form onSubmit={handleAddMovie} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '400px', marginTop: '20px' }}>
                    <input
                        type="text"
                        name="title"
                        placeholder="Movie Title (e.g. The Batman)"
                        value={newMovie.title}
                        onChange={handleInputChange}
                        required
                        style={{ padding: '12px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#333', color: 'white' }}
                    />
                    <input
                        type="text"
                        name="genre"
                        placeholder="Genre (e.g. Action / Noir)"
                        value={newMovie.genre}
                        onChange={handleInputChange}
                        required
                        style={{ padding: '12px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#333', color: 'white' }}
                    />
                    <input
                        type="text"
                        name="image"
                        placeholder="Poster Image Filename (e.g. batman.jpg)"
                        value={newMovie.image}
                        onChange={handleInputChange}
                        required
                        style={{ padding: '12px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#333', color: 'white' }}
                    />
                    <input
                        type="text"
                        name="screen"
                        placeholder="Background Screen Filename (e.g. batman-bg.jpg)"
                        value={newMovie.screen}
                        onChange={handleInputChange}
                        required
                        style={{ padding: '12px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#333', color: 'white' }}
                    />
                    <button
                        type="submit"
                        style={{ backgroundColor: '#e50914', color: '#fff', padding: '12px', fontSize: '16px', fontWeight: 'bold', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}
                    >
                        + Add Movie to Database
                    </button>
                </form>
            </div>
        </div>
    );
}