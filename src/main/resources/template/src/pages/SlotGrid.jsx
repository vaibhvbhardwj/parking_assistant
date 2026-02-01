import { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/slotGrid.css";

function SlotGrid({ parkingAreaId }) {
  const [slots, setSlots] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState("");

  useEffect(() => {
    loadSlots();
    loadVehicles();
  }, [parkingAreaId]);

  const loadSlots = async () => {
    const res = await api.get(`/api/slots/by-parking/${parkingAreaId}`);
    setSlots(res.data);
  };

  const loadVehicles = async () => {
    const res = await api.get("/api/vehicles/my");
    setVehicles(res.data);
  };

  // Group & sort slots
  const groupedSlots = slots.reduce((acc, slot) => {
    const row = slot.slotNumber[0];
    acc[row] = acc[row] || [];
    acc[row].push(slot);
    acc[row].sort(
      (a, b) =>
        Number(a.slotNumber.slice(1)) - Number(b.slotNumber.slice(1))
    );
    return acc;
  }, {});

  const bookSlot = async () => {
    if (!selectedVehicle) {
      alert("Please select a vehicle");
      return;
    }

    await api.post("/api/bookings/book", {
      slotId: selectedSlot,
      vehicleId: selectedVehicle
    });

    alert("Slot booked successfully!");
    setSelectedSlot(null);
    loadSlots();
  };

  return (
    <div className="slot-wrapper">
      <h3>Select Parking Slot</h3>

      {/* Legend */}
      <div className="legend">
        <span className="available">Available</span>
        <span className="selected">Selected</span>
        <span className="booked">Booked</span>
      </div>

      <div className="theater-grid">
        {Object.keys(groupedSlots).map(row => (
          <div key={row} className="row">
            <span className="row-label">{row}</span>

            {groupedSlots[row].map(slot => (
              <div
                key={slot._id}
                className={`slot 
                  ${slot.status === "BOOKED" ? "booked" : ""}
                  ${selectedSlot === slot._id ? "selected" : ""}
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
        <div className="booking-panel">
          <select
            value={selectedVehicle}
            onChange={e => setSelectedVehicle(e.target.value)}
          >
            <option value="">Select Vehicle</option>
            {vehicles.map(v => (
              <option key={v._id} value={v._id}>
                {v.vehicleNumber}
              </option>
            ))}
          </select>

          <p className="pricing-note">
            ₹50 base + ₹100 per hour (charged on release)
          </p>

          <button className="book-btn" onClick={bookSlot}>
            Confirm Booking
          </button>
        </div>
      )}
    </div>
  );
}

export default SlotGrid;
