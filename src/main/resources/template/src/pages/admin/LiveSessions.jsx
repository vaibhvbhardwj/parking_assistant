import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function LiveSessions() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    api.get("/api/bookings?status=ACTIVE").then(res => {
      setSessions(res.data);
    });
  }, []);

  return (
    <div>
      <h2>🟢 Live Sessions</h2>

      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Slot</th>
            <th>Vehicle</th>
            <th>Start Time</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map(s => (
            <tr key={s._id}>
              <td>{s.user?.name}</td>
              <td>{s.slot?.slotNumber}</td>
              <td>{s.vehicle?.vehicleNumber}</td>
              <td>{new Date(s.startTime).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
