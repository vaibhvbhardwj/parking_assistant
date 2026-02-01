import { useState, useEffect } from "react";
import api from "../../api/axios";
import { User, Mail, Phone, Shield } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import "../../styles/admin/AdminProfile.css";

const AVATAR_COLORS = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8",
  "#F7DC6F", "#BB8FCE", "#85C1E2", "#F8B739", "#52B788"
];

export default function AdminProfile() {
  const [user, setUser] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    profilePicture: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await api.get("/api/settings/me");
      setUser(res.data);
      setFormData({
        name: res.data.name,
        phone: res.data.phone,
        profilePicture: res.data.profilePicture || ""
      });
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMessage("");
      await api.put("/api/settings/profile", formData);
      setMessage("Profile updated successfully!");
      loadProfile();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name) => {
    const index = name.charCodeAt(0) % AVATAR_COLORS.length;
    return AVATAR_COLORS[index];
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      
      <div className="admin-content">
        <div className="page-header-admin">
          <div>
            <h1>Admin Profile</h1>
            <p>Manage your account settings</p>
          </div>
        </div>

        <div className="profile-container">
          <div className="profile-card">
            <div className="profile-avatar-section">
              <div className="avatar-container">
                <div 
                  className="profile-avatar-large" 
                  style={{ backgroundColor: formData.profilePicture || getAvatarColor(formData.name || "A") }}
                >
                  {getInitials(formData.name || "Admin")}
                </div>
                <button 
                  type="button"
                  className="change-avatar-btn"
                  onClick={() => setShowColorPicker(!showColorPicker)}
                >
                  Change Color
                </button>
              </div>
              
              {showColorPicker && (
                <div className="color-picker">
                  {AVATAR_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`color-option ${formData.profilePicture === color ? 'selected' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        setFormData({...formData, profilePicture: color});
                        setShowColorPicker(false);
                      }}
                    />
                  ))}
                </div>
              )}

              <h2>{formData.name}</h2>
              <p className="role-badge">
                <Shield size={16} />
                Administrator
              </p>
            </div>

            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-section">
                <h3>Personal Information</h3>
                
                <div className="form-group">
                  <label>
                    <User size={18} />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    <Mail size={18} />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="disabled-input"
                  />
                  <small>Email cannot be changed</small>
                </div>

                <div className="form-group">
                  <label>
                    <Phone size={18} />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required
                  />
                </div>
              </div>

              {message && (
                <div className={`message ${message.includes("success") ? "success" : "error"}`}>
                  {message}
                </div>
              )}

              <div className="form-actions">
                <button type="submit" className="btn-primary-admin" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}