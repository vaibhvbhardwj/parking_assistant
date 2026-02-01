import { useEffect, useState } from "react";
import api from "../api/axios";
import Sidebar from "../components/user/Sidebar";
import Topbar from "../components/user/Topbar";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { MapPin, Star, Navigation, Car, Clock, IndianRupee } from "lucide-react";
import ParkingAreaDetails from "../components/user/ParkingAreaDetails";
import "../styles/user/findParking.css";
import "../styles/user/dashboard.css";

export default function FindParking() {
  const [parkingAreas, setParkingAreas] = useState([]);
  const [nearbyAreas, setNearbyAreas] = useState([]);
  const [selectedParking, setSelectedParking] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAllParkingAreas();
  }, []);

  const loadAllParkingAreas = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/parking-areas");
      // Filter only active parking areas
      const activeAreas = res.data.filter(area => area.status === "ACTIVE");
      setParkingAreas(activeAreas);
    } catch (error) {
      console.error("Error loading parking areas:", error);
    } finally {
      setLoading(false);
    }
  };

  const locateAndLoadNearby = async (lat, lng) => {
    try {
      const res = await api.get(
        `/api/parking-areas/nearby?latitude=${lat}&longitude=${lng}&maxDistance=5000`
      );
      setNearbyAreas(res.data);
    } catch (error) {
      console.error("Error loading nearby areas:", error);
    }
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Topbar />
        <div className="find-parking-container">
      {/* Map Section */}
      <div className="map-section">
        <MapContainer
          center={userLocation || [28.7041, 77.1025]}
          zoom={13}
          className="map"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Parking Area Markers */}
          {parkingAreas.map(area => {
            if (!area.location?.coordinates) return null;
            const [lng, lat] = area.location.coordinates;

            return (
              <Marker key={area._id} position={[lat, lng]}>
                <Popup>
                  <div className="map-popup">
                    <h4>{area.name}</h4>
                    {area.availableSlots !== undefined && (
                      <p>{area.availableSlots}/{area.totalSlots} slots available</p>
                    )}
                    <button 
                      className="btn-primary-small"
                      onClick={() => setSelectedParking(area)}
                    >
                      View Details
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* User Location Marker */}
          {userLocation && (
            <Marker
              position={userLocation}
              icon={L.icon({
                iconUrl: "https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png",
                iconSize: [32, 32]
              })}
            >
              <Popup>You are here</Popup>
            </Marker>
          )}

          <LocateButton
            setUserLocation={setUserLocation}
            loadNearby={locateAndLoadNearby}
          />
        </MapContainer>
      </div>

      {/* Nearby Parking List */}
      {userLocation && nearbyAreas.length > 0 && (
        <div className="parking-list">
          <h3><MapPin size={20} /> Parking Near You</h3>
          
          <div className="parking-cards">
            {nearbyAreas.map(area => {
              const [lng, lat] = area.location.coordinates;

              return (
                <div key={area._id} className="parking-card">
                  <div className="parking-card-header">
                    <h4>{area.name}</h4>
                    <div className="rating">
                      <Star size={16} fill="#FFD700" color="#FFD700" />
                      <span>{area.averageRating ? area.averageRating.toFixed(1) : 'N/A'}</span>
                    </div>
                  </div>

                  <p className="address">{area.address}</p>

                  <div className="parking-info">
                    <span className="distance">
                      <MapPin size={16} />
                      {area.distance ? `${area.distance} km` : 'N/A'}
                    </span>
                    <span className="slots">
                      <Car size={16} />
                      {area.availableSlots || 0}/{area.totalSlots || 0} available
                    </span>
                    <span className="price">
                      <IndianRupee size={16} />
                      ₹{area.pricePerHour}/hr
                    </span>
                  </div>

                  <div className="card-actions">
                    <button 
                      className="btn-secondary"
                      onClick={() => setSelectedParking(area)}
                    >
                      View Details
                    </button>
                    <button
                      className="btn-icon"
                      onClick={() =>
                        window.open(
                          `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
                          "_blank"
                        )
                      }
                    >
                      <Navigation size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* No Nearby Areas Message */}
      {userLocation && nearbyAreas.length === 0 && (
        <div className="no-results">
          <MapPin size={48} />
          <p>No parking areas found nearby</p>
          <p className="hint">Try zooming out on the map</p>
        </div>
      )}

          {/* Parking Area Details Modal */}
          {selectedParking && (
            <ParkingAreaDetails
              parkingArea={selectedParking}
              onClose={() => setSelectedParking(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* Locate Button Component */
function LocateButton({ setUserLocation, loadNearby }) {
  const map = useMap();

  const locateUser = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setUserLocation([lat, lng]);
        map.setView([lat, lng], 15);
        loadNearby(lat, lng);
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Location permission denied or unavailable");
      }
    );
  };

  return (
    <button className="locate-btn" onClick={locateUser}>
      <MapPin size={20} />
      Near Me
    </button>
  );
}