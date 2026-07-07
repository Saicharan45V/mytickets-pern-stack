const movies = [
    {
        title: "Interstellar",
        genre: "Sci-Fi / Drama",
        image: "Screenshot 2026-06-30 123103.png",
        screen: "intrstellar-screen.jpg"
    },
    {
        title: "Gone Girl",
        genre: "Thriller / Mystery",
        image: "Screenshot 2026-06-30 123852.png",
        screen: "gonegirl-screen.jpg"
    },
    {
        title: "Shutter Island",
        genre: "Horror / Mystery",
        image: "Screenshot 2026-06-30 124120.png",
        screen: "shutterIsland-screen.jpg"
    },
    {
        title: "American Psycho",
        genre: "Horror / Comedy",
        image: "AmericanPhysco.jpg",
        screen: "AmericanPhysco-screen.jpg"
    }

];


const catalogSection = document.getElementById("catalog-section");

const bookingScreen = document.getElementById("booking-screen");

const container = document.getElementById("movie-container");

const bookButton = document.getElementById("hero-book-btn");

const heroSection = document.getElementById("hero-section");
const heroTitle = document.getElementById("hero-title");
const heroDesc = document.getElementById("hero-desc");

const theaterScreen = document.getElementById("theater-screen");
const timeButtons = document.querySelectorAll(".btn-time");
const btnBackToCatalog = document.getElementById("btn-back-to-catalog");

function rendermovies() {
    let htmlContent = "";
    movies.forEach(function (movie, index) {
        htmlContent += `
            <article class="movie-card">
                <img src="${movie.image}" alt="${movie.title} Poster">
                <h3>${movie.title}</h3>
                <p class="genre">${movie.genre}</p>
                <a href="#" class="btn-details" data-index="${index}">View Showtimes</a>
            </article>
        `;
    });

    container.innerHTML = htmlContent;
}

rendermovies();


bookButton.addEventListener("click", function () {
    heroTitle.innerText = `Booking: American Psycho`;

    bookButton.style.display = "none";

    catalogSection.style.display = "none";
    theaterScreen.style.display = "block";
});

const showtimeButtons = document.querySelectorAll(".btn-details");

showtimeButtons.forEach(function (button) {
    button.addEventListener("click", function (e) {

        e.preventDefault();

        // 1. Read the secret index from the button we just clicked
        const movieIndex = button.getAttribute("data-index");

        // 2. Find that specific movie in our array
        const selectedMovie = movies[movieIndex];

        // 3. Update the Hero Banner Text!
        heroTitle.innerText = `Booking: ${selectedMovie.title}`;
        heroDesc.innerText = selectedMovie.genre;

        // 4. Update the Hero Background Image!
        heroSection.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.4), #121212), url('${selectedMovie.screen}')`;

        //hiding herobook button
        bookButton.style.display = "none";

        //swap the screen
        catalogSection.style.display = "none";
        theaterScreen.style.display = "block";
    });
});


// --- SEAT SELECTION & PRICING LOGIC ---

// Grab the elements
const seatMap = document.getElementById("seat-map");
const count = document.getElementById("count");
const total = document.getElementById("total");
const ticketPrice = 250;

// Function to update the numbers
function updateSelectedCount() {
    const selectedSeats = document.querySelectorAll(".row .seat.selected");
    const selectedSeatsCount = selectedSeats.length;

    count.innerText = selectedSeatsCount;
    total.innerText = selectedSeatsCount * ticketPrice;
}

// Listen for clicks on the seat map container
seatMap.addEventListener("click", function (e) {
    // If they clicked a seat that is NOT occupied...
    if (e.target.classList.contains("seat") && !e.target.classList.contains("occupied")) {
        // Toggle the 'selected' class (turns it red based on our CSS)
        e.target.classList.toggle("selected");
        // Update the price
        updateSelectedCount();
    }
});


// --- NAVIGATION: GO BACK TO CATALOG ---

const btnBack = document.getElementById("btn-back");

btnBackToCatalog.addEventListener("click", function () {
    // 1. Swap the screens back
    theaterScreen.style.display = "none";
    catalogSection.style.display = "block";

    // 2. Un-hide the Hero Book Button
    bookButton.style.display = "block";

    // 3. Reset the Hero Banner text and image to default
    heroTitle.innerText = "Featured Movie: American Psycho";
    heroDesc.innerText = "Horror/Comedy ‧ 1h 42m";
    heroSection.style.backgroundImage = "linear-gradient(rgba(0, 0, 0, 0.4), #121212), url('2387080.jpg')";
});

const btnCheckout = document.getElementById("btn-checkout");

btnCheckout.addEventListener("click", function () {
    //number of seats selected
    const selectedSeats = document.querySelectorAll(".row .seat.selected");

    if (selectedSeats.length === 0) {
        // If no seats are selected, warn them and stop the function early
        alert("Please select at least one seat before proceeding.");
        return;
    }

    // 2. Package the data into an object (This is our "Payload")
    const bookingData = {
        movieTitle: heroTitle.innerText.replace("Booking: ", "").replace("Featured Movie: ", ""),
        numberOfSeats: selectedSeats.length,
        totalCost: selectedSeats.length * ticketPrice
    };

    // 3. Save the data to the browser's Local Storage (must be converted to a string first!)
    localStorage.setItem("myTicketsBooking", JSON.stringify(bookingData));

    // 4. Alert the user of success
    alert(`Success! You booked ${bookingData.numberOfSeats} seats for ${bookingData.movieTitle}. Total: ₹${bookingData.totalCost}`);

    // 5. (Optional) Reset the seats so the next person can book
    selectedSeats.forEach(seat => seat.classList.remove("selected"));
    updateSelectedCount();
});

timeButtons.forEach(function (button) {
    button.addEventListener("click", function (e) {
        e.preventDefault();

        theaterScreen.style.display = "none";
        bookingScreen.style.display = "block";
    });
});

btnBack.addEventListener("click", function () {
    bookingScreen.style.display = "none";
    theaterScreen.style.display = "block";
});