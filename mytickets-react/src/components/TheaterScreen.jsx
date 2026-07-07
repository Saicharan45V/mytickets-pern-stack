function TheaterScreen({ onBack, onSelectTime }) {
    return (
        <section className="theater-screen" style={{ padding: "40px 5%" }}>
            <h2>Select Theater & Time</h2>
            <div className="theater-list">
                <div className="theater-card">
                    <h3>Prasads Multiplex</h3>
                    <p>Necklace Road</p>
                    <div className="timings">
                        <button className="btn-time" onClick={() => onSelectTime("Prasads Multiplex", "10:30 AM")}>10:30 AM</button>
                        <button className="btn-time" onClick={() => onSelectTime("Prasads Multiplex", "02:15 PM")}>02:15 PM</button>
                        <button className="btn-time" onClick={() => onSelectTime("Prasads Multiplex", "06:00 PM")}>06:00 PM</button>
                    </div>
                </div>
                <div className="theater-card">
                    <h3>AMB Cinemas</h3>
                    <p>Gachibowli</p>
                    <div className="timings">
                        <button className="btn-time" onClick={() => onSelectTime("AMB Cinemas", "11:00 AM")}>11:00 AM</button>
                        <button className="btn-time" onClick={() => onSelectTime("AMB Cinemas", "03:30 PM")}>03:30 PM</button>
                        <button className="btn-time" onClick={() => onSelectTime("AMB Cinemas", "09:15 PM")}>09:15 PM</button>
                    </div>
                </div>
            </div>
            <br /><br />
            <button onClick={onBack} style={{ background: "none", color: "#7f8c8d", border: "none", cursor: "pointer" }}>Go Back to Catalog</button>
        </section>
    );
}

export default TheaterScreen;