import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" />;

  // Check role access
  if (role) {
    if (role === "admin") {
      // Admin routes accept both "admin" and "company_admin"
      if (userRole !== "admin" && userRole !== "company_admin") {
        return <Navigate to="/login" />;
      }
    } else if (role === "user") {
      // User routes only accept "user"
      if (userRole !== "user") {
        return <Navigate to="/login" />;
      }
    } else {
      // Exact match for other roles
      if (role !== userRole) {
        return <Navigate to="/login" />;
      }
    }
  }

  return children;
}

export default ProtectedRoute;
