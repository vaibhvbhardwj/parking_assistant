import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Sidebar from "../components/user/Sidebar";
import Topbar from "../components/user/Topbar";
import ActiveBookingCard from "../components/user/ActiveBookingCard";
import DashStats from "../components/user/DashStats";
import { MapPin, Car, Clock, TrendingUp } from "lucide-react";
import "../styles/user/dashboard.css";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [bookingRes, statsRes] = await Promise.all([
        api.get("/api/bookings/my"),
        api.get("/api/analytics/user")
      ]);

      const active = bookingRes.data.find(b => b.status === "ACTIVE");
      setBooking(active);
      setAnalytics(statsRes.data);
    } catch (err) {
      console.error("Dashboard Load Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Topbar />
        
        <div className="dashboard-content">
          {/* Current Session Section */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">Current Session</h2>
              {!booking && (
                <button 
                  className="section-action"
                  onClick={() => navigate("/user/find-parking")}
                >
                  <MapPin size={20} />
                  Find Parking
                </button>
              )}
            </div>

            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
              </div>
            ) : booking ? (
              <ActiveBookingCard booking={booking} refresh={loadDashboardData} />
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <Car size={32} />
                </div>
                <h3>No Active Parking Session</h3>
                <p>Start a new parking session by finding available spots near you</p>
                <button 
                  className="empty-state-action"
                  onClick={() => navigate("/user/find-parking")}
                >
                  <MapPin size={20} />
                  Find Parking
                </button>
              </div>
            )}
          </div>

          {/* Insights & Activity Section */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">Insights & Activity</h2>
            </div>

            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
              </div>
            ) : analytics ? (
              <DashStats data={analytics} />
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <TrendingUp size={32} />
                </div>
                <h3>No Analytics Data</h3>
                <p>Your parking activity and insights will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}