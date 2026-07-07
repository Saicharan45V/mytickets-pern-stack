// 1. We add 'onSelectMovie' into our props list inside the curly braces
function MovieCard({ title, genre, image, onSelectMovie }) {
    return (
        <article className="movie-card">
            <img src={image} alt={`${title} Poster`} />
            <h3>{title}</h3>
            <p className="genre">{genre}</p>

            {/* 2. Attach the passed-down function to the onClick event! */}
            <button className="btn-details" onClick={onSelectMovie}>
                View Showtimes
            </button>
        </article>
    );
}

export default MovieCard;