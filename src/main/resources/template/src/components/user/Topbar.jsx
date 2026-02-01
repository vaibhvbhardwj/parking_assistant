import { Bell, Search } from "lucide-react";
import { useState, useEffect } from "react";
import ProfileAvatar from "../ProfileAvatar";
import "../../styles/user/Topbar.css";

export default function Topbar() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  return (
    <div className="topbar">
      <div className="topbar-left">
        <div className="search-box">
          <Search size={20} />
          <input type="text" placeholder="Search..." />
        </div>
      </div>

      <div className="topbar-right">
        <button className="icon-btn notification-btn">
          <Bell size={20} />
          <span className="badge">3</span>
        </button>

        <div className="user-menu">
          <ProfileAvatar name={userName || "User"} size={40} />
          <div className="user-info">
            <span className="user-name">{userName || "User"}</span>
            <span className="user-role">Member</span>
          </div>
        </div>
      </div>
    </div>
  );
}