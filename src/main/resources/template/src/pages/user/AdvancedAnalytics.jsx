import { useState, useEffect } from "react";
import api from "../../api/axios";
import Sidebar from "../../components/user/Sidebar";
import Topbar from "../../components/user/Topbar";
import { BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, Clock, MapPin, Calendar } from "lucide-react";
import "../../styles/user/AdvancedAnalytics.css";

const COLORS = ['#006AFF', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function AdvancedAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const res = await api.get("/api/analytics/advanced-user");
      setAnalytics(res.data);
    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDayOfWeek = (data) => {
    return data.map(item => ({
      day: DAYS[item._id - 1] || 'N/A',
      spent: item.totalSpent,
      sessions: item.count
    }));
  };

  const formatMonthly = (data) => {
    return data.map(item => ({
      month: `${item._id.month}/${item._id.year}`,
      spent: item.totalSpent,
      sessions: item.sessions
    })).reverse();
  };

  if (loading) {
    return (
      <div className="layout">
        <Sidebar />
        <div className="main">
          <Topbar />
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Topbar />
        
        <div className="analytics-content">
          <div className="analytics-header">
            <h1>Advanced Analytics</h1>
            <p>Deep insights into your parking habits and spending</p>
          </div>

          {/* Key Insights */}
          <div className="insights-grid">
            <div className="insight-card">
              <div className="insight-icon" style={{ background: 'rgba(0, 106, 255, 0.1)', color: '#006AFF' }}>
                <TrendingUp size={24} />
              </div>
              <div className="insight-content">
                <h3>₹{analytics?.timeAnalysis?.avgTicket?.toFixed(2) || 0}</h3>
                <p>Avg. Ticket Price</p>
              </div>
            </div>

            <div className="insight-card">
              <div className="insight-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>
                <Clock size={24} />
              </div>
              <div className="insight-content">
                <h3>{analytics?.timeAnalysis?.avgDuration?.toFixed(1) || 0}h</h3>
                <p>Avg. Duration</p>
              </div>
            </div>

            <div className="insight-card">
              <div className="insight-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B' }}>
                <Calendar size={24} />
              </div>
              <div className="insight-content">
                <h3>{analytics?.timeAnalysis?.totalDuration?.toFixed(1) || 0}h</h3>
                <p>Total Time Parked</p>
              </div>
            </div>

            <div className="insight-card">
              <div className="insight-icon" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6' }}>
                <MapPin size={24} />
              </div>
              <div className="insight-content">
                <h3>{analytics?.topLocations?.length || 0}</h3>
                <p>Locations Visited</p>
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="charts-grid">
            {/* Day of Week Spending */}
            <div className="chart-card">
              <div className="chart-header">
                <h3>Spending by Day of Week</h3>
                <p>Which days do you spend the most?</p>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={formatDayOfWeek(analytics?.dayOfWeekSpending || [])}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="day" stroke="var(--textDim)" />
                  <YAxis stroke="var(--textDim)" />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'var(--card)', 
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      color: 'var(--text)'
                    }}
                  />
                  <Bar dataKey="spent" fill="#006AFF" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Monthly Trends */}
            <div className="chart-card">
              <div className="chart-header">
                <h3>Monthly Spending Trends</h3>
                <p>Your spending over the last year</p>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={formatMonthly(analytics?.monthlyTrends || [])}>
                  <defs>
                    <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" stroke="var(--textDim)" />
                  <YAxis stroke="var(--textDim)" />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'var(--card)', 
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      color: 'var(--text)'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="spent" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorSpent)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Top Locations */}
            <div className="chart-card full-width">
              <div className="chart-header">
                <h3>Your Favorite Parking Locations</h3>
                <p>Most frequently visited parking areas</p>
              </div>
              <div className="locations-grid">
                {analytics?.topLocations?.map((location, index) => (
                  <div key={index} className="location-item">
                    <div className="location-rank" style={{ background: COLORS[index % COLORS.length] }}>
                      #{index + 1}
                    </div>
                    <div className="location-details">
                      <h4>{location._id || 'Unknown'}</h4>
                      <div className="location-stats">
                        <span>{location.visits} visits</span>
                        <span>•</span>
                        <span>₹{location.totalSpent.toFixed(2)} spent</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Insights Summary */}
          <div className="insights-summary">
            <h3>💡 Key Insights</h3>
            <ul>
              <li>You spend an average of ₹{analytics?.timeAnalysis?.avgTicket?.toFixed(2) || 0} per parking session</li>
              <li>Your total parking time is {analytics?.timeAnalysis?.totalDuration?.toFixed(1) || 0} hours</li>
              <li>You've visited {analytics?.topLocations?.length || 0} different parking locations</li>
              <li>Your most frequented location is {analytics?.topLocations?.[0]?._id || 'N/A'}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}