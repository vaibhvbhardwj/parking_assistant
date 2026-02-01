import { useState } from "react";
import api from "../../api/axios";

export default function EndSession() {
  const [bookingId, setBookingId] = useState("");

  const endSession = async () => {
    const res = await api.post("/api/bookings/release", { bookingId });
    alert(`Total ₹${res.data.totalAmount}`);
  };

  return (
    <div className="admin-form">
      <h2>⏹️ End Parking Session</h2>

      <input
        placeholder="Booking ID"
        value={bookingId}
        onChange={e => setBookingId(e.target.value)}
      />

      <button onClick={endSession}>End Session</button>
    </div>
  );
}
