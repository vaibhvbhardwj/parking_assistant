import api from "../api/axios";

export default function ActiveBookingCard({ booking, refresh }) {
  const releaseSlot = async () => {
    const res = await api.post("/api/bookings/cancel", {
      bookingId: booking._id,
    });

    alert(`Amount to pay: ₹${res.data.totalAmount}`);
    refresh();
  };

  return (
    <div className="booking-card">
      <h3>My Active Parking</h3>
      <p>Slot: {booking.slot.slotNumber}</p>
      <p>Status: {booking.status}</p>
      <button onClick={releaseSlot}>Release Slot</button>
    </div>
  );
}
