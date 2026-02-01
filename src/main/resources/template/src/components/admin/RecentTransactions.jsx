import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function RecentTransactions() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    api.get("/api/admin/bookings?limit=5")
      .then(res => setBookings(res.data));
  }, []);

  return (
    <div className="recent-transactions">
      <h3>Recent Transactions</h3>

      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Slot</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(b => (
            <tr key={b._id}>
              <td>{b.user?.email}</td>
              <td>{b.slot?.slotNumber}</td>
              <td>₹{b.totalAmount}</td>
              <td>{b.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
