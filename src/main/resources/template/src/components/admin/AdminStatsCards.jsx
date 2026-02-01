import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AdminStatsCards() {
  const [stats, setStats] = useState({
    totalAreas: 0,
    totalSlots: 0,
    activeSessions: 0,
    revenue: 0
  });

  useEffect(() => {
    api.get("/api/admin/stats").then(res => setStats(res.data));
  }, []);

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <h4>Parking Areas</h4>
        <p>{stats.totalAreas}</p>
      </div>
      <div className="stat-card">
        <h4>Total Slots</h4>
        <p>{stats.totalSlots}</p>
      </div>
      <div className="stat-card">
        <h4>Active Sessions</h4>
        <p>{stats.activeSessions}</p>
      </div>
      <div className="stat-card">
        <h4>Revenue</h4>
        <p>₹{stats.revenue}</p>
      </div>
    </div>
  );
}
