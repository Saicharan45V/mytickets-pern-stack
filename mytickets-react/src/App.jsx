import { useState, useEffect } from 'react';
import './App.css';
import TheaterScreen from './components/TheaterScreen';
import Header from './components/Header';
import MovieCard from './components/MovieCard';
import BookingScreen from './components/BookingScreen';
import AuthScreen from './components/AuthScreen';
import MyBookingsScreen from './components/MyBookingsScreen';
import AdminDashboard from './components/AdminDashboard';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function App() {
  const [movies, setMovies] = useState([]);
  const [currentScreen, setCurrentScreen] = useState('catalog');
  const [activeMovie, setActiveMovie] = useState(null);

  // Tracks chosen theater & time
  const [selectedTheater, setSelectedTheater] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  // Tracks Logged In User from localStorage
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("myticketsUser");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    fetch(`${API_URL}/api/movies`)
      .then((response) => response.json())
      .then((data) => {
        setMovies(data);
        setActiveMovie(data[3] || data[0]);
      })
      .catch((error) => console.error("❌ Backend error:", error));
  }, []);

  // Top Nav Click Handler
  const handleTopNavigation = (screenName) => {
    if (screenName === 'dashboard' && !user) {
      alert("🔒 Please log in first to view your personal bookings!");
      setCurrentScreen('auth');
      return;
    }

    // 👈 ADD THIS ADMIN CHECK
    if (screenName === 'admin') {
      const isAdmin = localStorage.getItem("isAdmin") === "true" || localStorage.getItem("isAdmin") === true;
      if (!isAdmin) {
        alert("🚨 Access Denied. Admins only!");
        return;
      }
    }

    setCurrentScreen(screenName);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem("myticketsUser", JSON.stringify(userData));
    setCurrentScreen('catalog');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("myticketsUser");
    setCurrentScreen('catalog');
  };

  if (!activeMovie || movies.length === 0) {
    return (
      <div>
        <Header currentScreen={currentScreen} onNavigate={handleTopNavigation} user={user} onLogout={handleLogout} />
        <main style={{ textAlign: 'center', padding: '100px 20px', color: '#fff' }}>
          <h2>🎬 Loading mytickets Catalog from Server...</h2>
        </main>
      </div>
    );
  }

  return (
    <div>
      {/* WIRED UP TOP NAVIGATION */}
      <Header
        currentScreen={currentScreen}
        onNavigate={handleTopNavigation}
        user={user}
        onLogout={handleLogout}
      />

      <main>
        {/* EXACT ORIGINAL HERO BANNER RESTORED */}
        {(currentScreen === 'catalog' || currentScreen === 'theater') && (
          <section
            className="hero-banner"
            style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), #121212), url('${activeMovie.screen}')` }}
          >
            <div className="hero-content">
              <h2>
                {currentScreen === 'catalog' ? 'Featured Movie: ' : 'Booking: '}
                {activeMovie.title}
              </h2>

              <p>{activeMovie.genre}</p>

              {currentScreen === 'catalog' && (
                <button
                  className="btn-book"
                  onClick={() => setCurrentScreen('theater')}
                >
                  Book Now
                </button>
              )}
            </div>
          </section>
        )}

        {/* CONDITION 1: CATALOG SCREEN */}
        {currentScreen === 'catalog' && (
          <section className="movie-catalog">
            <h2>Now Showing</h2>
            <div className="movies-grid">
              {movies.map((movie, index) => (
                <MovieCard
                  key={movie.id || index}
                  title={movie.title}
                  genre={movie.genre}
                  image={movie.image}
                  onSelectMovie={() => {
                    setActiveMovie(movie);
                    setCurrentScreen('theater');
                  }}
                />
              ))}
            </div>
          </section>
        )}

        {/* CONDITION 2: THEATER & SHOWTIME SCREEN */}
        {currentScreen === 'theater' && (
          <TheaterScreen
            onBack={() => {
              setCurrentScreen('catalog');
              setActiveMovie(movies[3] || movies[0]);
            }}
            onSelectTime={(theaterName, showTime) => {
              setSelectedTheater(theaterName);
              setSelectedTime(showTime);
              setCurrentScreen('booking');
            }}
          />
        )}

        {/* CONDITION 3: BOOKING SCREEN */}
        {currentScreen === 'booking' && (
          <BookingScreen
            movieTitle={activeMovie.title}
            theater={selectedTheater}
            showtime={selectedTime}
            user={user}
            onRequireLogin={() => setCurrentScreen('auth')}
            onBack={() => setCurrentScreen('theater')}
          />
        )}

        {/* CONDITION 4: AUTH SCREEN (LOGIN / REGISTER) */}
        {currentScreen === 'auth' && (
          <AuthScreen
            onLoginSuccess={handleLoginSuccess}
            onBack={() => setCurrentScreen('catalog')}
          />
        )}

        {/* CONDITION 5: USER BOOKINGS DASHBOARD */}
        {currentScreen === 'dashboard' && (
          <MyBookingsScreen
            user={user}
            onBack={() => setCurrentScreen('catalog')}
          />
        )}

        {/* 👈 CONDITION 6: ADMIN DASHBOARD */}
        {currentScreen === 'admin' && (
          <AdminDashboard />
        )}

      </main>
    </div>
  );
}

export default App;