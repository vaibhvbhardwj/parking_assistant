import { useState, useEffect } from "react";
import api from "../../api/axios";
import { X, Car, Clock, IndianRupee, CreditCard } from "lucide-react";
import PaymentModal from "./PaymentModal";
import "../../styles/user/SlotBooking.css";

export default function SlotBooking({ slot, parkingArea, onClose }) {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [estimatedDuration, setEstimatedDuration] = useState(1);
  const [estimatedAmount, setEstimatedAmount] = useState(0);
  const [booking, setBooking] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadVehicles();
  }, []);

  useEffect(() => {
    // Calculate estimated amount
    if (estimatedDuration && parkingArea) {
      const amount = parkingArea.basePrice + (estimatedDuration * parkingArea.pricePerHour);
      setEstimatedAmount(amount);
    }
  }, [estimatedDuration, parkingArea]);

  const loadVehicles = async () => {
    try {
      const res = await api.get("/api/vehicles/my");
      setVehicles(res.data);
      if (res.data.length > 0) {
        setSelectedVehicle(res.data[0]._id);
      }
    } catch (error) {
      console.error("Error loading vehicles:", error);
    }
  };

  const handleBooking = async () => {
    if (!selectedVehicle) {
      setError("Please select a vehicle");
      return;
    }

    if (estimatedDuration < 0.5) {
      setError("Minimum duration is 30 minutes");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await api.post("/api/bookings/book", {
        slotId: slot._id,
        vehicleId: selectedVehicle,
        estimatedDuration: estimatedDuration
      });

      setBooking(res.data.booking);
      setShowPayment(true);
    } catch (error) {
      setError(error.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    onClose();
    // Redirect to user dashboard or active booking page
    window.location.href = "/user";
  };

  if (showPayment && booking) {
    return (
      <PaymentModal
        booking={booking}
        onSuccess={handlePaymentSuccess}
        onClose={() => {
          setShowPayment(false);
          onClose();
        }}
      />
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content booking-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Book Parking Slot</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="booking-details">
          {/* Parking Info */}
          <div className="info-section">
            <h3>Parking Details</h3>
            <div className="detail-row">
              <span>Location:</span>
              <strong>{parkingArea.name}</strong>
            </div>
            <div className="detail-row">
              <span>Slot:</span>
              <strong>
                {slot.slotNumber} - Floor {slot.floor}
                {slot.slotType !== "NORMAL" && ` (${slot.slotType})`}
              </strong>
            </div>
          </div>

          {/* Vehicle Selection */}
          <div className="form-section">
            <label>
              <Car size={20} />
              Select Vehicle
            </label>
            {vehicles.length === 0 ? (
              <p className="error-text">
                No vehicles registered. Please add a vehicle first.
              </p>
            ) : (
              <select
                value={selectedVehicle}
                onChange={(e) => setSelectedVehicle(e.target.value)}
              >
                {vehicles.map(vehicle => (
                  <option key={vehicle._id} value={vehicle._id}>
                    {vehicle.vehicleNumber} ({vehicle.vehicleType})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Duration Input */}
          <div className="form-section">
            <label>
              <Clock size={20} />
              Estimated Duration (hours)
            </label>
            <input
              type="number"
              min="0.5"
              step="0.5"
              value={estimatedDuration}
              onChange={(e) => setEstimatedDuration(parseFloat(e.target.value))}
            />
            <small>Minimum 30 minutes. You can extend or end early.</small>
          </div>

          {/* Price Breakdown */}
          <div className="price-section">
            <h3>Price Breakdown</h3>
            <div className="price-row">
              <span>Base Price:</span>
              <span>₹{parkingArea.basePrice}</span>
            </div>
            <div className="price-row">
              <span>Hourly Rate:</span>
              <span>₹{parkingArea.pricePerHour} × {estimatedDuration}h</span>
            </div>
            <div className="price-row total">
              <strong>Estimated Total:</strong>
              <strong>₹{estimatedAmount.toFixed(2)}</strong>
            </div>
            <small className="price-note">
              *Final amount will be calculated based on actual duration
            </small>
          </div>

          {error && <div className="error-message">{error}</div>}

          {/* Action Buttons */}
          <div className="action-buttons">
            <button className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn-primary"
              onClick={handleBooking}
              disabled={loading || vehicles.length === 0}
            >
              {loading ? (
                "Booking..."
              ) : (
                <>
                  <CreditCard size={20} />
                  Proceed to Payment
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}