import { useState, useEffect } from "react";
import api from "../../api/axios";
import { Building2, Plus } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import "../../styles/admin/CompanyManagement.css";

export default function CompanyManagement() {
  const [companies, setCompanies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    registrationNumber: "",
    email: "",
    phone: "",
    address: "",
    adminOption: "current", // current, new, existing
    adminId: "",
    adminName: "",
    adminEmail: "",
    adminPhone: "",
    adminPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      const res = await api.get("/api/companies");
      setCompanies(res.data);
    } catch (error) {
      console.error("Error loading companies:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      const payload = {
        name: formData.name,
        registrationNumber: formData.registrationNumber,
        email: formData.email,
        phone: formData.phone,
        address: formData.address
      };

      if (formData.adminOption === "current") {
        // Use current logged-in user
      } else if (formData.adminOption === "new") {
        payload.createNewAdmin = true;
        payload.adminName = formData.adminName;
        payload.adminEmail = formData.adminEmail;
        payload.adminPhone = formData.adminPhone;
        payload.adminPassword = formData.adminPassword;
      } else if (formData.adminOption === "existing") {
        payload.adminId = formData.adminId;
      }

      const response = await api.post("/api/companies/register", payload);
      
      if (response.data.adminCredentials) {
        alert(`Company registered! Admin credentials:\nEmail: ${response.data.adminCredentials.email}\nPassword: ${formData.adminPassword}`);
      }
      
      setShowModal(false);
      setFormData({
        name: "",
        registrationNumber: "",
        email: "",
        phone: "",
        address: "",
        adminOption: "current",
        adminId: "",
        adminName: "",
        adminEmail: "",
        adminPhone: "",
        adminPassword: ""
      });
      loadCompanies();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to register company");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      
      <div className="admin-content">
        <div className="page-header-admin">
        <div>
          <h1>Company Management</h1>
          <p>Register and manage parking companies</p>
        </div>
        <button className="btn-primary-admin" onClick={() => setShowModal(true)}>
          <Plus size={20} />
          Register Company
        </button>
        </div>

        <div className="companies-grid">
        {companies.map(company => (
          <div key={company._id} className="company-card">
            <div className="company-header">
              <Building2 size={32} />
              <span className={`status-badge ${company.status.toLowerCase()}`}>
                {company.status}
              </span>
            </div>
            
            <h3>{company.name}</h3>
            <p className="reg-number">Reg: {company.registrationNumber}</p>
            
            <div className="company-details">
              <p><strong>Email:</strong> {company.email}</p>
              <p><strong>Phone:</strong> {company.phone}</p>
              <p><strong>Admin:</strong> {company.admin?.name}</p>
            </div>

            <p className="address">{company.address}</p>
          </div>
        ))}
        </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Register New Company</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Company Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Registration Number</label>
                <input
                  type="text"
                  value={formData.registrationNumber}
                  onChange={(e) => setFormData({...formData, registrationNumber: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Admin Assignment</label>
                <select
                  value={formData.adminOption}
                  onChange={(e) => setFormData({...formData, adminOption: e.target.value})}
                  required
                >
                  <option value="current">Use my account as admin</option>
                  <option value="new">Create new admin user</option>
                  <option value="existing">Use existing user ID</option>
                </select>
              </div>

              {formData.adminOption === "existing" && (
                <div className="form-group">
                  <label>Admin User ID</label>
                  <input
                    type="text"
                    value={formData.adminId}
                    onChange={(e) => setFormData({...formData, adminId: e.target.value})}
                    placeholder="Enter user ID"
                    required
                  />
                </div>
              )}

              {formData.adminOption === "new" && (
                <>
                  <div className="form-group">
                    <label>Admin Name</label>
                    <input
                      type="text"
                      value={formData.adminName}
                      onChange={(e) => setFormData({...formData, adminName: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Admin Email</label>
                    <input
                      type="email"
                      value={formData.adminEmail}
                      onChange={(e) => setFormData({...formData, adminEmail: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Admin Phone</label>
                    <input
                      type="tel"
                      value={formData.adminPhone}
                      onChange={(e) => setFormData({...formData, adminPhone: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Admin Password</label>
                    <input
                      type="password"
                      value={formData.adminPassword}
                      onChange={(e) => setFormData({...formData, adminPassword: e.target.value})}
                      placeholder="Create password for new admin"
                      required
                    />
                  </div>
                </>
              )}

              {error && <div className="error-message">{error}</div>}

              <div className="form-actions">
                <button type="button" className="btn-secondary-admin" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary-admin" disabled={loading}>
                  {loading ? "Registering..." : "Register Company"}
                </button>
              </div>
            </form>
          </div>
          </div>
        )}
      </div>
    </div>
  );
}