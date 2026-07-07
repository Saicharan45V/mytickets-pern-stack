import { useState } from "react";
function CheckoutForm() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        ticketType: "Standard" // Can be "Standard", "VIP", or "IMAX"
    });
    const [name, setName] = useState("");
    const [yemail, setEmail] = useState("");

    return (
        <>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="text" value={yemail} onChange={(e) => setEmail(e.target.value)} />
            <label htmlFor="type-ticket">Choose ticket Type:</label>
            <select value={formData.ticketType} onChange={(e) => setFormData({ ...formData, ticketType: e.target.value })}>
                <option value="">--Please choose an option--</option>
                <option value="Standard">Standard</option>
                <option value="VIP">VIP</option>
                <option value="IMAX">IMAX</option>
            </select>
            <button onClick={() => {
                setFormData({
                    ...formData,
                    fullName: name,
                    email: yemail
                });
            }}>CHECK OUT</button>
        </>
    )
}

export default CheckoutForm;