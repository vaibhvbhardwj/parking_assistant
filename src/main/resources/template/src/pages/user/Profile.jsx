import { useEffect, useState } from "react";
import api from "../../api/axios";
import Sidebar from "../../components/user/Sidebar";
import Topbar from "../../components/user/Topbar";
import ProfileAvatar from "../../components/ProfileAvatar";
import { User, Mail, Phone, Save } from "lucide-react";
import "../../styles/user/profile.css";
import "../../styles/user/dashboard.css";

const AVATAR_COLORS = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8",
  "#F7DC6F", "#BB8FCE", "#85C1E2", "#F8B739", "#52B788"
];

export default function Profile() {
  const [user, setUser] = useState({});
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const res = await api.get("/api/settings/me");
    setUser(res.data);
    setName(res.data.name);
    setPhone(res.data.phone);
    setProfilePicture(res.data.profilePicture || "");
  };

  const saveProfile = async () => {
    try {
      setLoading(true);
      setMessage("");
      await api.put("/api/settings/profile", { name, phone, profilePicture });
      localStorage.setItem("userName", name);
      localStorage.setItem("profilePicture", profilePicture);
      setMessage("Profile updated successfully!");
      loadProfile();
    } catch (error) {
      setMessage("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (fullName) => {
    if (!fullName) return "U";
    return fullName
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (fullName) => {
    if (!fullName) return AVATAR_COLORS[0];
    const index = fullName.charCodeAt(0) % AVATAR_COLORS.length;
    return AVATAR_COLORS[index];
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Topbar />
        <div className="profile-page">
          <div className="profile-header">
            <div className="avatar-section">
              <div 
                className="profile-avatar-custom" 
                style={{ backgroundColor: profilePicture || getAvatarColor(name || "User") }}
              >
                {getInitials(name || "User")}
              </div>
              <button 
                type="button"
                className="change-color-btn"
                onClick={() => setShowColorPicker(!showColorPicker)}
              >
                Change Color
              </button>
              
              {showColorPicker && (
                <div className="color-picker-popup">
                  {AVATAR_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`color-option ${profilePicture === color ? 'selected' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        setProfilePicture(color);
                        setShowColorPicker(false);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
            <div>
              <h2>{name || "User"}</h2>
              <p>Member</p>
            </div>
          </div>

          <div className="profile-form">
            <div className="form-group">
              <label>
                <User size={18} />
                Full Name
              </label>
              <input value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="form-group">
              <label>
                <Mail size={18} />
                Email
              </label>
              <input value={user.email} disabled className="disabled-input" />
              <small>Email cannot be changed</small>
            </div>

            <div className="form-group">
              <label>
                <Phone size={18} />
                Phone
              </label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>

            {message && (
              <div className={`message ${message.includes("success") ? "success" : "error"}`}>
                {message}
              </div>
            )}

            <button onClick={saveProfile} disabled={loading} className="save-btn">
              <Save size={20} />
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}