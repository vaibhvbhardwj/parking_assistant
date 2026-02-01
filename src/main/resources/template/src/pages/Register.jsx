import { useState } from "react";
import api from "../api/axios";
import "../styles/Auth.css";
import { useNavigate } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: ""
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/auth/register", {
        ...form,
        role: "user"
      });
      alert("Registration successful");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="wrapper">
        <form onSubmit={handleSubmit}>
          <h2>Create Account</h2>

          {["name", "email", "phone", "password"].map(field => (
            <div className="input-field" key={field}>
              <input
                type={field === "password" ? "password" : "text"}
                required
                autoComplete={field === "password" ? "new-password" : "off"}
                onChange={e => setForm({ ...form, [field]: e.target.value })}
              />
              <label>{field.toUpperCase()}</label>
            </div>
          ))}

          <button type="submit">Register</button>

          <div className="register">
            <p>Already have an account? <a href="/login">Login</a></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
