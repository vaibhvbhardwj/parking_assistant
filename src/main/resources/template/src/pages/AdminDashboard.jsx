import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { 
  MapPin, 
  SquareParking, 
  Users, 
  TrendingUp,
  Plus,
  Activity,
  Menu
} from "lucide-react";
import api from "../api/axios";
import AdminSidebar from "../components/admin/AdminSidebar";
import "../styles/admin/AdminDashboard.css";

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalAreas: 0,
    totalSlots: 0,
    activeSessions: 0,
    revenue: 0
  });

  const [occupancyData, setOccupancyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
    loadAnalytics();
  }, []);

  const loadStats = async () => {
    try {
      const res = await api.get("/api/admin/stats");
      setStats(res.data);
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const loadAnalytics = async () => {
    try {
      const res = await api.get("/api/analytics/admin");
      if (res.data.occupancyChart && res.data.occupancyChart.length > 0) {
        setOccupancyData(res.data.occupancyChart);
      } else {
        // Fallback data if no bookings exist yet
        setOccupancyData([
          { time: "00:00", occupancy: 0 },
          { time: "04:00", occupancy: 0 },
          { time: "08:00", occupancy: 0 },
          { time: "12:00", occupancy: 0 },
          { time: "16:00", occupancy: 0 },
          { time: "20:00", occupancy: 0 }
        ]);
      }
    } catch (error) {
      console.error("Error loading analytics:", error);
      // Set fallback data
      setOccupancyData([
        { time: "00:00", occupancy: 0 },
        { time: "04:00", occupancy: 0 },
        { time: "08:00", occupancy: 0 },
        { time: "12:00", occupancy: 0 },
        { time: "16:00", occupancy: 0 },
        { time: "20:00", occupancy: 0 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { 
      label: "Total Areas", 
      value: stats.totalAreas, 
      icon: MapPin, 
      color: "#06B6D4",
      trend: "+12%"
    },
    { 
      label: "Total Slots", 
      value: stats.totalSlots, 
      icon: SquareParking, 
      color: "#8B5CF6",
      trend: "+8%"
    },
    { 
      label: "Active Sessions", 
      value: stats.activeSessions, 
      icon: Users, 
      color: "#10B981",
      trend: "+24%"
    },
    { 
      label: "Total Revenue", 
      value: `₹${stats.revenue.toLocaleString()}`, 
      icon: TrendingUp, 
      color: "#F59E0B",
      trend: "+18%"
    }
  ];

  return (
    <div className="admin-layout">
      <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <div className="admin-content">
        <div className="page-header-admin">
          <button className="hamburger-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu size={24} />
          </button>
          <div>
            <h1>Admin Dashboard</h1>
            <p>Seamless Parking Management</p>
          </div>
          <div className="header-actions">
            <Link to="/admin/parking-areas/create" className="btn-primary-admin">
              <Plus size={20} />
              Add Parking Area
            </Link>
          </div>
        </div>

        <div className="stats-grid-admin">
          {statCards.map((stat, index) => (
            <div key={index} className="stat-card-admin">
              <div className="stat-header">
                <div className="stat-icon" style={{ background: `${stat.color}20`, color: stat.color }}>
                  <stat.icon size={24} />
                </div>
                <span className="stat-trend">{stat.trend}</span>
              </div>
              <div className="stat-body">
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card occupancy-chart">
            <div className="card-header">
              <div>
                <h3>Live Occupancy Chart</h3>
                <p>Real-time parking utilization</p>
              </div>
              <Activity size={20} className="header-icon" />
            </div>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                <div className="spinner" style={{ width: 40, height: 40 }}></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={occupancyData}>
                <defs>
                  <linearGradient id="colorOccupancy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
                <XAxis dataKey="time" stroke="#8B949E" />
                <YAxis stroke="#8B949E" />
                <Tooltip 
                  contentStyle={{ 
                    background: '#161B22', 
                    border: '1px solid #30363D',
                    borderRadius: '8px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="occupancy" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorOccupancy)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="dashboard-card quick-stats">
            <div className="card-header">
              <h3>Quick Stats</h3>
            </div>
            <div className="quick-stats-grid">
              <div className="quick-stat-item">
                <span className="label">Occupancy Rate</span>
                <span className="value">78%</span>
              </div>
              <div className="quick-stat-item">
                <span className="label">Avg. Session</span>
                <span className="value">2.5h</span>
              </div>
              <div className="quick-stat-item">
                <span className="label">Peak Hours</span>
                <span className="value">9AM-6PM</span>
              </div>
              <div className="quick-stat-item">
                <span className="label">Total Companies</span>
                <span className="value">12</span>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-card recent-activity">
          <div className="card-header">
            <h3>Recent Activity</h3>
            <Link to="/admin/live-sessions" className="view-all-link">View All</Link>
          </div>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon active">
                <Activity size={16} />
              </div>
              <div className="activity-content">
                <p className="activity-title">New booking at Downtown Parking</p>
                <p className="activity-time">2 minutes ago</p>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon success">
                <SquareParking size={16} />
              </div>
              <div className="activity-content">
                <p className="activity-title">Mall Parking Area went live</p>
                <p className="activity-time">15 minutes ago</p>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon info">
                <Users size={16} />
              </div>
              <div className="activity-content">
                <p className="activity-title">5 new sessions started</p>
                <p className="activity-time">30 minutes ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}