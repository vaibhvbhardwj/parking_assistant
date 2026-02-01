import { useState, useEffect } from "react";
import api from "../../api/axios";
import { X, Star, MapPin, Clock, IndianRupee, Car, Building2 } from "lucide-react";
import SlotBooking from "./SlotBooking";
import "../../styles/user/ParkingAreaDetails.css";

export default function ParkingAreaDetails({ parkingArea, onClose }) {
  const [details, setDetails] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDetails();
    loadRatings();
  }, [parkingArea._id]);

  const loadDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/parking-areas/${parkingArea._id}`);
      setDetails(res.data);
      
      // Set initial floor
      if (res.data.slotsByFloor && res.data.slotsByFloor.length > 0) {
        setSelectedFloor(res.data.slotsByFloor[0]._id);
      }
    } catch (error) {
      console.error("Error loading details:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadRatings = async () => {
    try {
      const res = await api.get(`/api/ratings/parking-area/${parkingArea._id}?limit=5`);
      setRatings(res.data.ratings || []);
    } catch (error) {
      console.error("Error loading ratings:", error);
    }
  };

  const handleSlotSelect = (slot) => {
    if (slot.status === "AVAILABLE") {
      setSelectedSlot(slot);
      setShowBooking(true);
    }
  };

  if (loading) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  const floorData = details?.slotsByFloor?.find(f => f._id === selectedFloor);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content parking-details" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2>{parkingArea.name}</h2>
            <p className="address">
              <MapPin size={16} />
              {parkingArea.address}
            </p>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Info Section */}
        <div className="parking-info-section">
          <div className="info-card">
            <div className="rating">
              <Star size={20} fill="#FFD700" color="#FFD700" />
              <span>{parkingArea.averageRating?.toFixed(1) || 'N/A'}</span>
              <small>({parkingArea.totalRatings || 0} ratings)</small>
            </div>
          </div>

          <div className="info-card">
            <IndianRupee size={20} />
            <div>
              <strong>₹{parkingArea.pricePerHour}/hour</strong>
              <small>Base: ₹{parkingArea.basePrice}</small>
            </div>
          </div>

          <div className="info-card">
            <Clock size={20} />
            <div>
              <strong>Open 24/7</strong>
              <small>{details?.operatingHours?.open || '00:00'} - {details?.operatingHours?.close || '23:59'}</small>
            </div>
          </div>

          <div className="info-card">
            <Building2 size={20} />
            <div>
              <strong>{parkingArea.totalFloors || 1} Floors</strong>
              <small>{details?.slotsByFloor?.reduce((sum, f) => sum + f.total, 0) || 0} total slots</small>
            </div>
          </div>
        </div>

        {/* Amenities */}
        {parkingArea.amenities && parkingArea.amenities.length > 0 && (
          <div className="amenities">
            <h3>Amenities</h3>
            <div className="amenity-tags">
              {parkingArea.amenities.map((amenity, idx) => (
                <span key={idx} className="amenity-tag">{amenity}</span>
              ))}
            </div>
          </div>
        )}

        {/* Floor Selection */}
        <div className="floor-section">
          <h3>Select Floor</h3>
          <div className="floor-tabs">
            {details?.slotsByFloor?.map(floor => (
              <button
                key={floor._id}
                className={`floor-tab ${selectedFloor === floor._id ? 'active' : ''}`}
                onClick={() => setSelectedFloor(floor._id)}
              >
                Floor {floor._id}
                <small>{floor.available}/{floor.total} available</small>
              </button>
            ))}
          </div>
        </div>

        {/* Slot Grid */}
        <div className="slot-grid-section">
          <h3>Available Slots - Floor {selectedFloor}</h3>
          <div className="slot-legend">
            <span><span className="legend-box available"></span> Available</span>
            <span><span className="legend-box booked"></span> Booked</span>
            <span><span className="legend-box handicapped"></span> Handicapped</span>
            <span><span className="legend-box ev"></span> EV Charging</span>
            <span><span className="legend-box maintenance"></span> Maintenance</span>
          </div>

          {floorData && (
            <div className="slot-stats">
              <span>Available: {floorData.available}</span>
              <span>Booked: {floorData.booked}</span>
              <span>Maintenance: {floorData.maintenance}</span>
            </div>
          )}

          <SlotGridDisplay
            parkingAreaId={parkingArea._id}
            floor={selectedFloor}
            onSlotSelect={handleSlotSelect}
          />
        </div>

        {/* Ratings Section */}
        {ratings.length > 0 && (
          <div className="ratings-section">
            <h3>Recent Reviews</h3>
            <div className="ratings-list">
              {ratings.map(rating => (
                <div key={rating._id} className="rating-card">
                  <div className="rating-header">
                    <strong>{rating.user?.name || 'Anonymous'}</strong>
                    <div className="rating-stars">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill={i < rating.rating ? "#FFD700" : "none"}
                          color="#FFD700"
                        />
                      ))}
                    </div>
                  </div>
                  {rating.review && <p className="review-text">{rating.review}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Booking Modal */}
        {showBooking && selectedSlot && (
          <SlotBooking
            slot={selectedSlot}
            parkingArea={parkingArea}
            onClose={() => {
              setShowBooking(false);
              setSelectedSlot(null);
              loadDetails(); // Refresh slots
            }}
          />
        )}
      </div>
    </div>
  );
}

// Slot Grid Display Component
function SlotGridDisplay({ parkingAreaId, floor, onSlotSelect }) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSlots();
  }, [parkingAreaId, floor]);

  const loadSlots = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/slots/by-parking/${parkingAreaId}?floor=${floor}`);
      setSlots(res.data.slots || []);
    } catch (error) {
      console.error("Error loading slots:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading slots...</div>;

  if (slots.length === 0) {
    return <div className="no-slots">No slots available on this floor</div>;
  }

  return (
    <div className="slot-grid">
      {slots.map(slot => (
        <button
          key={slot._id}
          className={`slot-item ${slot.status.toLowerCase()} ${slot.slotType.toLowerCase()}`}
          onClick={() => onSlotSelect(slot)}
          disabled={slot.status !== "AVAILABLE"}
        >
          <Car size={16} />
          <span>{slot.slotNumber}</span>
          {slot.slotType !== "NORMAL" && (
            <span className="slot-type-badge">{slot.slotType}</span>
          )}
        </button>
      ))}
    </div>
  );
}