import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, Plus, Edit, Trash2, Power, SquareParking } from "lucide-react";
import api from "../../api/axios";
import AdminSidebar from "../../components/admin/AdminSidebar";
import "../../styles/admin/ParkingAreas.css";

export default function ParkingAreas() {
  const [parkingAreas, setParkingAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadParkingAreas();
  }, []);

  const loadParkingAreas = async () => {
    try {
      const res = await api.get("/api/parking-areas");
      setParkingAreas(res.data);
    } catch (error) {
      console.error("Error loading parking areas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMakeLive = async (id) => {
    try {
      await api.patch(`/api/parking-areas/${id}/make-live`);
      loadParkingAreas();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to make parking area live");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure? This will delete all associated slots.")) return;
    
    try {
      await api.delete(`/api/parking-areas/${id}`);
      loadParkingAreas();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete parking area");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "ACTIVE": return "success";
      case "INACTIVE": return "warning";
      case "UNDER_MAINTENANCE": return "danger";
      default: return "default";
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      
      <div className="admin-content">
        <div className="page-header-admin">
          <div>
            <h1>Parking Areas</h1>
            <p>Manage all parking locations</p>
          </div>
          <Link to="/admin/parking-areas/create" className="btn-primary-admin">
            <Plus size={20} />
            Create Parking Area
          </Link>
        </div>

        {loading ? (
          <div className="loading-state">Loading...</div>
        ) : parkingAreas.length === 0 ? (
          <div className="empty-state">
            <SquareParking size={64} />
            <h3>No parking areas yet</h3>
            <p>Create your first parking area to get started</p>
            <Link to="/admin/parking-areas/create" className="btn-primary-admin">
              <Plus size={20} />
              Create Parking Area
            </Link>
          </div>
        ) : (
          <div className="parking-areas-grid">
            {parkingAreas.map(area => (
              <div key={area._id} className="parking-area-card">
                <div className="area-header">
                  <div className="area-title">
                    <MapPin size={24} />
                    <div>
                      <h3>{area.name}</h3>
                      <p className="company-name">{area.company?.name}</p>
                    </div>
                  </div>
                  <span className={`status-badge ${getStatusColor(area.status)}`}>
                    {area.status}
                  </span>
                </div>

                <div className="area-details">
                  <div className="detail-item">
                    <span className="label">Layout</span>
                    <span className="value">{area.layoutType}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Floors</span>
                    <span className="value">{area.totalFloors}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Price/Hour</span>
                    <span className="value">₹{area.pricePerHour}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Base Price</span>
                    <span className="value">₹{area.basePrice}</span>
                  </div>
                </div>

                <div className="area-address">
                  <MapPin size={14} />
                  <span>{area.address}</span>
                </div>

                <div className="area-actions">
                  <Link 
                    to={`/admin/parking-areas/${area._id}/slots`}
                    className="btn-action btn-primary"
                  >
                    <SquareParking size={16} />
                    Manage Slots
                  </Link>
                  {area.status !== "ACTIVE" && (
                    <button 
                      onClick={() => handleMakeLive(area._id)}
                      className="btn-action btn-success"
                    >
                      <Power size={16} />
                      Make Live
                    </button>
                  )}
                  <Link 
                    to={`/admin/parking-areas/${area._id}/edit`}
                    className="btn-action btn-secondary"
                  >
                    <Edit size={16} />
                  </Link>
                  <button 
                    onClick={() => handleDelete(area._id)}
                    className="btn-action btn-danger"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}