import { useState, useEffect } from "react";

function MovieCatalog() {

    const [movies, setMovies] = useState([]);
    useEffect(() => {
        // 2. Make an HTTP GET request to your running Node server
        fetch("http://localhost:5000/api/movies")
            .then((response) => response.json()) // Convert the raw network response into JSON
            .then((data) => {
                console.log("📥 Received movies from server:", data);
                setMovies(data); // 3. Save the live server data into React state!
            })
            .catch((error) => {
                console.error("❌ Error fetching movies:", error);
            });
    }, []);

    const [selectedGenre, setSelectedGenre] = useState("All");
    const filteredMovies = selectedGenre === "All"
        ? Movies
        : Movies.filter((movie) => movie.genre === selectedGenre);

    return (
        <>
            <h2>Movie Catalog</h2>

            {/* We hand the Child the Parent's state setter function! */}
            <GenreFilter onSelectGenre={setSelectedGenre} />

            {/* Step 4 goes below here */}
            <ul>
                {filteredMovies.map((movie, index) => (
                    <li key={index}>
                        <strong>{movie.title}</strong> ({movie.genre})
                    </li>
                ))}
            </ul>
        </>
    );
}

export default MovieCatalog;