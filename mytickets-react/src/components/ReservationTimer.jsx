import { useState, useEffect } from "react";

function ReservationTimer() {
    const [secondsLeft, setSecondsLeft] = useState(60);

    useEffect(() => {
        // This runs automatically when the component loads onto the screen
        const timer = setInterval(() => {
            setSecondsLeft((prevSeconds) => prevSeconds - 1);
        }, 1000);

        // Cleanup: stops the timer if the user leaves the screen!
        return () => clearInterval(timer);
    }, []);

    return (
        <>
            {secondsLeft > 0 ? (
                /* Render Active Timer UI here */
                <h3>"⚠️ Hurry! You have {secondsLeft} seconds left to complete your booking!"</h3>
            ) : (
                /* Render Expired UI here */
                <h3>"⏳ Reservation Expired! Your seats have been released."</h3>
            )}
        </>
    );
}

export default ReservationTimer;