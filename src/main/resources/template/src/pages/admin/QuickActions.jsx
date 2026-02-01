import { useNavigate } from "react-router-dom";
import "../../styles/admin/QuickActions.css";

const actions = [
  { title: "Start Session", path: "/admin/start-session", icon: "▶️" },
  { title: "End Session", path: "/admin/end-session", icon: "⏹️" },
  { title: "Live Sessions", path: "/admin/live-sessions", icon: "🟢" },
  { title: "Manage Parking", path: "/admin/parking", icon: "🅿️" },
  { title: "Slot Layout Editor", path: "/admin/layout", icon: "🧩" },
  { title: "Reports", path: "/admin/reports", icon: "📊" }
];

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="qa-container">
      <h2>⚡ Quick Actions</h2>

      <div className="qa-grid">
        {actions.map(action => (
          <div
            key={action.title}
            className="qa-card"
            onClick={() => navigate(action.path)}
          >
            <span className="qa-icon">{action.icon}</span>
            <p>{action.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
