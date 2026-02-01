import { useNavigate } from "react-router-dom";

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="quick-actions">
      <h4>Quick Actions</h4>

      <button onClick={() => navigate("/admin/add-parking")}>
        ➕ Add Parking Area
      </button>

      <button onClick={() => navigate("/admin/layout")}>
        🧱 Slot Layout Editor
      </button>

      <button onClick={() => navigate("/admin/reports")}>
        📊 Reports
      </button>
    </div>
  );
}
