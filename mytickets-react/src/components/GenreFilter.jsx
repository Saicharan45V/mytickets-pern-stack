import { useState } from "react";

function GenreFilter({ onSelectGenre }) {
    return (
        <div>
            {/* Step 2b: Add your buttons here! */}
            <button onClick={() => onSelectGenre("All")}>All</button>
            <button onClick={() => onSelectGenre("Sci-fi")}>Sci-fi</button>
            <button onClick={() => onSelectGenre("Drama")}>Drama</button>
            <button onClick={() => onSelectGenre("Rom-com")}>Rom-com</button>
            <button onClick={() => onSelectGenre("Thriller")}>Thriller</button>
        </div>
    );
}

export default GenreFilter;