import { useEffect, useState } from "react";
import api from "../api/axios";
import "./styles/slotgrid.css";

function SlotGrid({ parkingAreaId }) {
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (parkingAreaId) {
      loadSlots();
    }
  }, [parkingAreaId]);

  const loadSlots = async () => {
    try {
      const res = await api.get(`/api/slots/by-parking/${parkingAreaId}`);
      setSlots(res.data);
    } catch (err) {
      console.error("Failed to load slots", err);
    }
  };

  // Group slots by row letter (A, B, C...)
  const groupedSlots = slots.reduce((acc, slot) => {
    const row = slot.slotNumber[0];
    acc[row] = acc[row] || [];
    acc[row].push(slot);
    return acc;
  }, {});

  const bookSlot = async () => {
    if (!selectedSlot) return;

    const vehicleId = prompt("Enter Vehicle ID");
    if (!vehicleId) return;

    try {
      setLoading(true);
      await api.post("/api/bookings/book", {
        slotId: selectedSlot,
        vehicleId,
      });

      alert("✅ Slot booked successfully");
      setSelectedSlot(null);
      loadSlots();
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="slot-grid-container">
      <h3 className="slot-grid-title">Select Parking Slot</h3>

      <div className="theater-grid">
        {Object.keys(groupedSlots).map((row) => (
          <div key={row} className="row">
            <span className="row-label">{row}</span>

            {groupedSlots[row].map((slot) => (
              <div
                key={slot._id}
                className={`slot
                  ${slot.status === "BOOKED" ? "booked" : ""}
                  ${selectedSlot === slot._id ? "selected" : ""}
                  ${slot.slotType === "EV" ? "ev" : ""}
                  ${slot.slotType === "HANDICAPPED" ? "handicapped" : ""}
                `}
                onClick={() =>
                  slot.status !== "BOOKED" && setSelectedSlot(slot._id)
                }
              >
                {slot.slotNumber.slice(1)}
              </div>
            ))}
          </div>
        ))}
      </div>

      {selectedSlot && (
        <button
          className="book-btn"
          onClick={bookSlot}
          disabled={loading}
        >
          {loading ? "Booking..." : "Book Slot"}
        </button>
      )}
    </div>
  );
}

export default SlotGrid;
