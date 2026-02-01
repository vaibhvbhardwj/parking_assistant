import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  MapPin, 
  Car, 
  History, 
  User, 
  HelpCircle,
  LogOut,
  Menu,
  X,
  TrendingUp
} from "lucide-react";
import { useState } from "react";
import "../../styles/user/sidebar.css";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    { path: "/user", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/user/find-parking", icon: MapPin, label: "Find Parking" },
    { path: "/user/myvehicles", icon: Car, label: "My Vehicles" },
    { path: "/user/history", icon: History, label: "History" },
    { path: "/user/advanced-analytics", icon: TrendingUp, label: "Advanced Analytics" },
    { path: "/user/profile", icon: User, label: "Profile" },
    { path: "/", icon: HelpCircle, label: "Help" },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

  return (
    <>
      {/* Mobile Menu Button */}
      <button className="mobile-menu-btn" onClick={toggleMobile}>
        <Menu size={24} />
      </button>

      {/* Mobile Overlay */}
      <div 
        className={`sidebar-overlay ${isMobileOpen ? "active" : ""}`} 
        onClick={toggleMobile}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${isMobileOpen ? "mobile-open" : ""}`}>
        {/* Header */}
        <div className="sidebar-header">
          <div className="logo-section">
            <img src="/logo.png" alt="ParkEase" className="logo-image" />
            <h2 className="logo-text">ParkEase</h2>
          </div>
          <button className="mobile-close-btn" onClick={toggleMobile}>
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <ul className="menu-list">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`menu-item ${isActive(item.path) ? "active" : ""}`}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}