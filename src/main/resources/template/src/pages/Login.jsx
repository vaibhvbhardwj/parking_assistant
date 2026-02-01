import { useState } from "react";
import api from "../api/axios";
import "../styles/Auth.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("userName", res.data.name);
      localStorage.setItem("profilePicture", res.data.profilePicture || "");

      navigate(res.data.role === "admin" ? "/admin" : "/user");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-page">
      <Navbar/>
      <div className="wrapper">
        <form onSubmit={handleSubmit}>
          <h2>Welcome Back</h2>
          
          <div className="input-field">
            <input type="email" autoComplete="off" aut required onChange={e => setEmail(e.target.value)} />
            <label>Email</label>
          </div>

          <div className="input-field">
            <input type="password" autoComplete="new-password" required onChange={e => setPassword(e.target.value)} />
            <label>Password</label>
          </div>

          <button type="submit">Login</button>

          <div className="register">
            <p>Don’t have an account? <a href="/register">Register</a></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
