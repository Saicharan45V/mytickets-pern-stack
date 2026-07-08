

function Header({ currentScreen, onNavigate, user, onLogout }) {
    const isAdmin = localStorage.getItem("isAdmin") === "true" || localStorage.getItem("isAdmin") === true;
    return (
        <header className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 5%', background: '#121212', borderBottom: '1px solid #222' }}>
            {/* Brand Logo */}
            <div className="logo" onClick={() => onNavigate('catalog')} style={{ cursor: 'pointer' }}>
                <h1 style={{ color: '#e50914', margin: 0, fontSize: '1.8rem' }}><a href="#" style={{ color: 'whitesmoke' }}>my</a>tickets</h1>
            </div>

            {/* Top Navigation Buttons */}
            <nav style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
                <button
                    onClick={() => onNavigate('catalog')}
                    style={{ background: 'none', border: 'none', color: currentScreen === 'catalog' ? '#e50914' : '#fff', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' }}
                >
                    <strong>Home</strong>
                </button>

                <button
                    onClick={() => onNavigate('catalog')}
                    style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1rem' }}
                >
                    <strong>Movies</strong>
                </button>

                <button
                    onClick={() => onNavigate('theater')}
                    style={{ background: 'none', border: 'none', color: currentScreen === 'theater' ? '#e50914' : '#fff', cursor: 'pointer', fontSize: '1rem' }}
                >
                    <strong>Theaters</strong>
                </button>

                <button
                    onClick={() => onNavigate('dashboard')}
                    style={{ background: 'none', border: 'none', color: currentScreen === 'dashboard' ? '#e50914' : '#fff', cursor: 'pointer', fontSize: '1rem' }}
                >
                    <strong>My Bookings</strong>
                </button>

                {isAdmin && (
                    <button
                        onClick={() => onNavigate('admin')}
                        style={{ color: 'red', fontWeight: 'bold', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                        Admin Dashboard
                    </button>
                )}

                {/* Dynamic Login / User Profile Button */}
                {user ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#1f1f1f', padding: '5px 12px', borderRadius: '20px' }}>
                        <span style={{ color: '#fff', fontSize: '0.9rem' }}>👤 {user.username}</span>
                        <button
                            onClick={onLogout}
                            style={{ background: '#e50914', border: 'none', color: '#fff', padding: '4px 10px', borderRadius: '12px', cursor: 'pointer', fontSize: '0.8rem' }}
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => onNavigate('auth')}
                        className="btn-book"
                        style={{ padding: '6px 16px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                    >
                        Login
                    </button>
                )}
            </nav>
        </header>
    );
}

export default Header;