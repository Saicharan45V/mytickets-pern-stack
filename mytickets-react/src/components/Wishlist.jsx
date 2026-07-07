import { useState } from "react";

function Wishlist() {
    const [movieInput, setMovieInput] = useState("");
    const [wishlist, setWishlist] = useState(["Dune: Part Two", "The Dark Knight"]);

    return (
        <>
            <input type="text" value={movieInput}
                onChange={(e) => setMovieInput(e.target.value)} /><button
                    onClick={() => {
                        setWishlist([...wishlist, movieInput]);
                        setMovieInput("");
                    }}>Add Movie</button>
            <ul>
                {wishlist.map((movie, index) => (
                    <li key={index}>
                        {movie} <button onClick={() => { setWishlist(wishlist.filter((_, itemIndex) => itemIndex !== index)) }}>Remove ❌</button>
                    </li>
                ))}
            </ul>
        </>

    )
}

export default Wishlist;