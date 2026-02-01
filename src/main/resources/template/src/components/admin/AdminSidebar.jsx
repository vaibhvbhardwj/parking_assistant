import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, Building2, MapPin, SquareParking, 
  Settings, BarChart3, Users, Home, X 
} from "lucide-react";
import "../../styles/admin/AdminSidebar.css";

// Accept isOpen and toggleSidebar as props
export default function AdminSidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();

  const navItems = [
    { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/admin/companies", icon: Building2, label: "Companies" },
    { path: "/admin/parking-areas", icon: MapPin, label: "Parking Areas" },
    { path: "/admin/slots", icon: SquareParking, label: "Manage Slots" },
    { path: "/admin/live-sessions", icon: Users, label: "Live Sessions" },
    { path: "/admin/reports", icon: BarChart3, label: "Reports" },
    { path: "/admin/advanced-analytics", icon: BarChart3, label: "Advance Reports" },
    { path: "/", icon: Home, label: "Back to Home" }
  ];

  return (
    <>
      {/* Overlay for mobile: clicking outside sidebar closes it */}
      <div 
        className={`admin-sidebar-overlay ${isOpen ? "active" : ""}`} 
        onClick={toggleSidebar}
      />

      <div className={`admin-sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="logo">
            <SquareParking size={32} />
            <span>ADMIN</span>
          </div>
          {/* Close button only visible on mobile */}
          <button className="admin-mobile-close-btn" onClick={toggleSidebar}>
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
              onClick={() => {
                if (window.innerWidth < 1024) toggleSidebar(); // Auto-close on link click (mobile)
              }}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}