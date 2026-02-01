import { useState, useEffect } from "react";
import api from "../../api/axios";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, Users, Clock, AlertCircle } from "lucide-react";
import "../../styles/admin/AdvancedAnalytics.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const COLORS = ['#006AFF', '#10B981', '#F59E0B', '#EF4444'];

export default function AdvancedAnalyticsAdmin() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const downloadAnalyticsPDF = async () => {
  const element = document.getElementById("analytics-download");

  const canvas = await html2canvas(element, {
    scale: 2,            // high quality
    useCORS: true,
    backgroundColor: "#ffffff",
    scrollY: -window.scrollY
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  let heightLeft = pdfHeight;
  let position = 0;

  // FIRST PAGE
  pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
  heightLeft -= pdf.internal.pageSize.getHeight();

  // EXTRA PAGES IF CONTENT IS LONG
  while (heightLeft > 0) {
    position = heightLeft - pdfHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
    heightLeft -= pdf.internal.pageSize.getHeight();
  }

  pdf.save("advanced-analytics-report.pdf");
};


  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const res = await api.get("/api/analytics/advanced-admin");
      setAnalytics(res.data);
    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPeakHours = (data) => {
    return data.map(item => ({
      hour: `${item._id}:00`,
      sessions: item.sessions,
      revenue: item.revenue
    }));
  };

  const getRetentionData = () => {
    if (!analytics?.userRetention) return [];
    const { repeatUsers, oneTimeUsers, repeatRevenue, oneTimeRevenue } = analytics.userRetention;
    return [
      { name: 'Repeat Users', value: repeatUsers, revenue: repeatRevenue },
      { name: 'One-time Users', value: oneTimeUsers, revenue: oneTimeRevenue }
    ];
  };

  const getSlotData = () => {
    if (!analytics?.slotPerformance) return [];
    const { available, booked, outOfService } = analytics.slotPerformance;
    return [
      { name: 'Available', value: available },
      { name: 'Booked', value: booked },
      { name: 'Out of Service', value: outOfService }
    ];
  };

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminSidebar />
        <div className="admin-content">
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  const retentionData = getRetentionData();
  const slotData = getSlotData();

  return (
    <div className="admin-layout">
      <AdminSidebar />
      
      <div className="admin-content" id="analytics-download" >
        <div className="page-header-admin">
          <div>
            <h1>Advanced Analytics</h1>
            <p>Detailed insights into business performance and operations</p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="stats-grid-admin">
          <div className="stat-card-admin">
            <div className="stat-header">
              <div className="stat-icon" style={{ background: 'rgba(0, 106, 255, 0.1)', color: '#006AFF' }}>
                <TrendingUp size={24} />
              </div>
            </div>
            <div className="stat-body">
              <h3>₹{analytics?.revenueGrowth?.reduce((sum, day) => sum + day.revenue, 0).toFixed(2) || 0}</h3>
              <p>Revenue (Last 30 Days)</p>
            </div>
          </div>

          <div className="stat-card-admin">
            <div className="stat-header">
              <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>
                <Users size={24} />
              </div>
            </div>
            <div className="stat-body">
              <h3>{retentionData[0]?.value || 0}</h3>
              <p>Repeat Customers</p>
            </div>
          </div>

          <div className="stat-card-admin">
            <div className="stat-header">
              <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B' }}>
                <Clock size={24} />
              </div>
            </div>
            <div className="stat-body">
              <h3>{analytics?.peakHours?.reduce((max, h) => h.sessions > max ? h.sessions : max, 0) || 0}</h3>
              <p>Peak Hour Sessions</p>
            </div>
          </div>

          <div className="stat-card-admin">
            <div className="stat-header">
              <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}>
                <AlertCircle size={24} />
              </div>
            </div>
            <div className="stat-body">
              <h3>{slotData[2]?.value || 0}</h3>
              <p>Slots Out of Service</p>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="dashboard-grid">
          {/* Revenue Growth */}
          <div className="dashboard-card">
            <div className="card-header">
              <div>
                <h3>Revenue Growth Trend</h3>
                <p>Daily revenue over the last 30 days</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics?.revenueGrowth || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="_id" stroke="var(--textDim)" />
                <YAxis stroke="var(--textDim)" />
                <Tooltip 
                  contentStyle={{ 
                    background: 'var(--card)', 
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#006AFF" 
                  strokeWidth={3}
                  dot={{ fill: '#006AFF', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* User Retention */}
          <div className="dashboard-card">
            <div className="card-header">
              <div>
                <h3>Customer Retention</h3>
                <p>Repeat vs One-time customers</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={retentionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {retentionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    background: 'var(--card)', 
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Peak Hours */}
          <div className="dashboard-card" style={{ gridColumn: '1 / -1' }}>
            <div className="card-header">
              <div>
                <h3>Peak Demand Hours</h3>
                <p>Hourly session distribution showing peak occupancy times</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={formatPeakHours(analytics?.peakHours || [])}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="hour" stroke="var(--textDim)" />
                <YAxis stroke="var(--textDim)" />
                <Tooltip 
                  contentStyle={{ 
                    background: 'var(--card)', 
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text)'
                  }}
                />
                <Legend />
                <Bar dataKey="sessions" fill="#10B981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="revenue" fill="#006AFF" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Slot Performance */}
          <div className="dashboard-card">
            <div className="card-header">
              <div>
                <h3>Slot Performance</h3>
                <p>Current slot status distribution</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={slotData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {slotData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    background: 'var(--card)', 
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue Breakdown */}
          <div className="dashboard-card">
            <div className="card-header">
              <div>
                <h3>Revenue by Customer Type</h3>
                <p>Contribution from repeat vs one-time customers</p>
              </div>
            </div>
            <div className="revenue-breakdown">
              <div className="revenue-item">
                <div className="revenue-label">
                  <div className="revenue-dot" style={{ background: COLORS[0] }}></div>
                  <span>Repeat Customers</span>
                </div>
                <div className="revenue-value">
                  ₹{retentionData[0]?.revenue?.toFixed(2) || 0}
                  <span className="revenue-percentage">
                    {((retentionData[0]?.revenue / (retentionData[0]?.revenue + retentionData[1]?.revenue)) * 100).toFixed(0) || 0}%
                  </span>
                </div>
              </div>
              <div className="revenue-item">
                <div className="revenue-label">
                  <div className="revenue-dot" style={{ background: COLORS[1] }}></div>
                  <span>One-time Customers</span>
                </div>
                <div className="revenue-value">
                  ₹{retentionData[1]?.revenue?.toFixed(2) || 0}
                  <span className="revenue-percentage">
                    {((retentionData[1]?.revenue / (retentionData[0]?.revenue + retentionData[1]?.revenue)) * 100).toFixed(0) || 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Insights */}
        <div className="insights-panel">
          <h3>📊 Key Business Insights</h3>
          <div className="insights-list">
            <div className="insight-item">
              <strong>Peak Hours:</strong> Your parking lot reaches maximum occupancy around {formatPeakHours(analytics?.peakHours || []).reduce((max, h) => h.sessions > max.sessions ? h : max, {hour: 'N/A', sessions: 0}).hour}
            </div>
            <div className="insight-item">
              <strong>Customer Loyalty:</strong> {((retentionData[0]?.value / (retentionData[0]?.value + retentionData[1]?.value)) * 100).toFixed(0) || 0}% of your customers are repeat visitors
            </div>
            <div className="insight-item">
              <strong>Revenue Distribution:</strong> Repeat customers generate {((retentionData[0]?.revenue / (retentionData[0]?.revenue + retentionData[1]?.revenue)) * 100).toFixed(0) || 0}% of total revenue
            </div>
            <div className="insight-item">
              <strong>Operational Health:</strong> {slotData[2]?.value || 0} slots are currently out of service and may need attention
            </div>
          </div>
        </div>
        <div style={{ marginTop: "40px", textAlign: "center" }}>
  <button
    onClick={downloadAnalyticsPDF}
    style={{
      padding: "12px 24px",
      background: "#006AFF",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      fontSize: "16px",
      cursor: "pointer"
    }}
  >
    📥 Download Analytics Report (PDF)
  </button>
</div>

      </div>
    </div>
  );
}