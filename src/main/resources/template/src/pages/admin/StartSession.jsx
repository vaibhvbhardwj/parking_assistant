import { useState } from "react";
import api from "../../api/axios";

export default function StartSession() {
  const [slotId, setSlotId] = useState("");
  const [vehicleId, setVehicleId] = useState("");

  const startSession = async () => {
    await api.post("/api/bookings/book", { slotId, vehicleId });
    alert("Session started");
  };

  return (
    <div className="admin-form">
      <h2>▶️ Start Parking Session</h2>

      <input
        placeholder="Slot ID"
        value={slotId}
        onChange={e => setSlotId(e.target.value)}
      />

      <input
        placeholder="Vehicle ID"
        value={vehicleId}
        onChange={e => setVehicleId(e.target.value)}
      />

      <button onClick={startSession}>Start</button>
    </div>
  );
}
