import { useState } from "react";
import api from "../../api/axios";
import { X, CreditCard, Wallet, CheckCircle } from "lucide-react";
import "../../styles/user/PaymentModal.css";

export default function PaymentModal({ booking, onSuccess, onClose }) {
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentComplete, setPaymentComplete] = useState(false);

  const handleRazorpayPayment = async () => {
    try {
      setLoading(true);
      setError("");

      // Create Razorpay order
      const orderRes = await api.post("/api/payment/create-order", {
        bookingId: booking._id
      });

      const { orderId, amount, keyId } = orderRes.data;

      // Check if running in test mode
      const isTestMode = !keyId || keyId === "rzp_test_dummy";

      if (isTestMode) {
        // Use mock payment for development
        await handleMockPayment();
        return;
      }

      // Initialize Razorpay
      const options = {
        key: keyId,
        amount: amount,
        currency: "INR",
        name: "ParkEase",
        description: `Parking Booking - ${booking.parkingAreaName}`,
        order_id: orderId,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyRes = await api.post("/api/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: booking._id
            });

            setPaymentComplete(true);
            setTimeout(() => {
              onSuccess();
            }, 2000);
          } catch (error) {
            setError("Payment verification failed");
          }
        },
        prefill: {
          name: booking.user?.name || "",
          email: booking.user?.email || "",
          contact: booking.user?.phone || ""
        },
        theme: {
          color: "#006AFF"
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", function (response) {
        setError(response.error.description);
      });

      razorpay.open();
    } catch (error) {
      setError(error.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  const handleMockPayment = async () => {
    try {
      setLoading(true);
      setError("");

      // Simulate payment delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Call mock payment endpoint
      await api.post("/api/payment/mock", {
        bookingId: booking._id
      });

      setPaymentComplete(true);
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (error) {
      setError("Mock payment failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = () => {
    if (paymentMethod === "razorpay") {
      handleRazorpayPayment();
    } else if (paymentMethod === "mock") {
      handleMockPayment();
    }
  };

  if (paymentComplete) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content payment-success" onClick={(e) => e.stopPropagation()}>
          <CheckCircle size={64} color="#10B981" />
          <h2>Payment Successful!</h2>
          <p>Your parking slot has been booked successfully.</p>
          <p className="redirect-text">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  const amount = booking.estimatedAmount || booking.totalAmount || 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content payment-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Complete Payment</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="payment-content">
          {/* Booking Summary */}
          <div className="booking-summary">
            <h3>Booking Summary</h3>
            <div className="summary-row">
              <span>Location:</span>
              <strong>{booking.parkingAreaName}</strong>
            </div>
            <div className="summary-row">
              <span>Slot:</span>
              <strong>{booking.slot?.slotNumber} - Floor {booking.slot?.floor}</strong>
            </div>
            <div className="summary-row">
              <span>Vehicle:</span>
              <strong>{booking.vehicle?.vehicleNumber}</strong>
            </div>
            <div className="summary-row">
              <span>Estimated Duration:</span>
              <strong>{booking.estimatedDuration}h</strong>
            </div>
            <div className="summary-row total">
              <strong>Amount to Pay:</strong>
              <strong className="amount">₹{amount.toFixed(2)}</strong>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="payment-method-section">
            <h3>Select Payment Method</h3>
            
            <div className="payment-methods">
              <label className={`payment-option ${paymentMethod === "razorpay" ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="payment"
                  value="razorpay"
                  checked={paymentMethod === "razorpay"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="option-content">
                  <CreditCard size={24} />
                  <div>
                    <strong>Razorpay</strong>
                    <small>Credit/Debit Card, UPI, Wallets</small>
                  </div>
                </div>
              </label>

              <label className={`payment-option ${paymentMethod === "mock" ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="payment"
                  value="mock"
                  checked={paymentMethod === "mock"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="option-content">
                  <Wallet size={24} />
                  <div>
                    <strong>Mock Payment</strong>
                    <small>For testing only</small>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          {/* Action Buttons */}
          <div className="action-buttons">
            <button className="btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button
              className="btn-primary"
              onClick={handlePayment}
              disabled={loading}
            >
              {loading ? "Processing..." : `Pay ₹${amount.toFixed(2)}`}
            </button>
          </div>

          <p className="secure-note">
            🔒 Your payment is secure and encrypted
          </p>
        </div>
      </div>
    </div>
  );
}