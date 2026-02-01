import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { MapPin, Building2, Save } from "lucide-react";
import api from "../../api/axios";
import AdminSidebar from "../../components/admin/AdminSidebar";
import "../../styles/admin/CreateParkingArea.css";

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    }
  });

  return position ? <Marker position={position} /> : null;
}

export default function CreateParkingArea() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [position, setPosition] = useState([28.6139, 77.2090]); // Default: Delhi
  const [formData, setFormData] = useState({
    name: "",
    companyId: "",
    address: "",
    layoutType: "RECTANGULAR",
    totalFloors: 1,
    pricePerHour: 50,
    basePrice: 20,
    amenities: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      const res = await api.get("/api/companies");
      setCompanies(res.data);
    } catch (error) {
      console.error("Error loading companies:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.companyId) {
      setError("Please select a company");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await api.post("/api/parking-areas", {
        ...formData,
        latitude: position[0],
        longitude: position[1]
      });

      navigate("/admin/parking-areas");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create parking area");
    } finally {
      setLoading(false);
    }
  };

  const amenitiesList = ["CCTV", "Security", "EV Charging", "Covered", "24/7", "Wheelchair Access"];

  const toggleAmenity = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      
      <div className="admin-content">
        <div className="page-header-admin">
          <div>
            <h1>Create Parking Area</h1>
            <p>Add a new parking location to the system</p>
          </div>
        </div>

        <div className="create-parking-container">
          <form onSubmit={handleSubmit} className="parking-form">
            <div className="form-section">
              <h3>Basic Information</h3>
              
              <div className="form-group">
                <label>Parking Area Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., Downtown Parking Hub"
                  required
                />
              </div>

              <div className="form-group">
                <label>Company *</label>
                <select
                  value={formData.companyId}
                  onChange={(e) => setFormData({...formData, companyId: e.target.value})}
                  required
                >
                  <option value="">Select a company</option>
                  {companies.map(company => (
                    <option key={company._id} value={company._id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Address *</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="Enter full address"
                  rows={3}
                  required
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Layout Configuration</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Layout Type *</label>
                  <select
                    value={formData.layoutType}
                    onChange={(e) => setFormData({...formData, layoutType: e.target.value})}
                  >
                    <option value="RECTANGULAR">Rectangular</option>
                    <option value="CIRCULAR">Circular</option>
                    <option value="CUSTOM">Custom</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Total Floors *</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={formData.totalFloors}
                    onChange={(e) => setFormData({...formData, totalFloors: parseInt(e.target.value)})}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price per Hour (₹) *</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.pricePerHour}
                    onChange={(e) => setFormData({...formData, pricePerHour: parseInt(e.target.value)})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Base Price (₹) *</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({...formData, basePrice: parseInt(e.target.value)})}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Amenities</h3>
              <div className="amenities-grid">
                {amenitiesList.map(amenity => (
                  <label key={amenity} className="amenity-checkbox">
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => toggleAmenity(amenity)}
                    />
                    <span>{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="form-actions-sticky">
              <button 
                type="button" 
                className="btn-secondary-admin"
                onClick={() => navigate("/admin/parking-areas")}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn-primary-admin"
                disabled={loading}
              >
                <Save size={20} />
                {loading ? "Creating..." : "Create Parking Area"}
              </button>
            </div>
          </form>

          <div className="map-section">
            <h3>
              <MapPin size={20} />
              Select Location
            </h3>
            <p className="map-hint">Click on the map to set parking location</p>
            <div className="map-container">
              <MapContainer
                center={position}
                zoom={13}
                style={{ height: "100%", width: "100%", borderRadius: "12px" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker position={position} setPosition={setPosition} />
              </MapContainer>
            </div>
            <div className="coordinates">
              <span>Lat: {position[0].toFixed(6)}</span>
              <span>Lng: {position[1].toFixed(6)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}