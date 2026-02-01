import { useEffect, useState } from "react";
import api from "../../api/axios";
import Sidebar from "../../components/user/Sidebar";
import Topbar from "../../components/user/Topbar";
import "../../styles/user/history.css";
import "../../styles/user/dashboard.css";

export default function History() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const res = await api.get("/api/bookings/my");
    setBookings(res.data);
  };

  const totalSpent = bookings.reduce(
    (sum, b) => sum + (b.totalAmount || 0),
    0
  );

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Topbar />
        <div className="history-page">
          <h2>📊 Parking History</h2>

          <div className="analytics">
            <div>Total Bookings: {bookings.length}</div>
            <div>Total Spent: ₹{totalSpent}</div>
          </div>

          {bookings.map(b => (
            <div key={b._id} className="history-card">
              <b>Slot:</b> {b.slot?.slotNumber}<br />
              <b>Vehicle:</b> {b.vehicle?.vehicleNumber}<br />
              <b>Status:</b> {b.status}<br />
              <b>Amount:</b> ₹{b.totalAmount || "-"}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
