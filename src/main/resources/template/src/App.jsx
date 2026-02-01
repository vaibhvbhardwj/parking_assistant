import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";


// User Pages
import FindParking from "./pages/FindParking";
import History from "./pages/user/History";
import Profile from "./pages/user/Profile";
import MyVehicles from "./pages/user/MyVehicles";
import AdvancedAnalytics from "./pages/user/AdvancedAnalytics";

// Admin Pages
import QuickActions from "./pages/admin/QuickActions";
import StartSession from "./pages/admin/StartSession";
import EndSession from "./pages/admin/EndSession";
import LiveSessions from "./pages/admin/LiveSessions";
import Reports from "./pages/admin/Reports";
import CompanyManagement from "./pages/admin/CompanyManagement";
import ParkingAreas from "./pages/admin/ParkingAreas";
import CreateParkingArea from "./pages/admin/CreateParkingArea";
import SlotManagement from "./pages/admin/SlotManagement";
import AdvancedAnalyticsAdmin from "./pages/admin/AdvancedAnalytics";

import "./index.css";



export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected User Routes */}
        <Route
          path="/user"
          element={
            <ProtectedRoute role="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/find-parking"
          element={
            <ProtectedRoute role="user">
              <FindParking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/history"
          element={
            <ProtectedRoute role="user">
              <History />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/profile"
          element={
            <ProtectedRoute role="user">
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/myvehicles"
          element={
            <ProtectedRoute role="user">
              <MyVehicles />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/advanced-analytics"
          element={
            <ProtectedRoute role="user">
              <AdvancedAnalytics />
            </ProtectedRoute>
          }
        />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/companies"
          element={
            <ProtectedRoute role="admin">
              <CompanyManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/parking-areas"
          element={
            <ProtectedRoute role="admin">
              <ParkingAreas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/parking-areas/create"
          element={
            <ProtectedRoute role="admin">
              <CreateParkingArea />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/parking-areas/:areaId/slots"
          element={
            <ProtectedRoute role="admin">
              <SlotManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/slots"
          element={
            <ProtectedRoute role="admin">
              <SlotManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/quick-actions"
          element={
            <ProtectedRoute role="admin">
              <QuickActions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/start-session"
          element={
            <ProtectedRoute role="admin">
              <StartSession />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/end-session"
          element={
            <ProtectedRoute role="admin">
              <EndSession />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/live-sessions"
          element={
            <ProtectedRoute role="admin">
              <LiveSessions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute role="admin">
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/advanced-analytics"
          element={
            <ProtectedRoute role="admin">
              <AdvancedAnalyticsAdmin />
            </ProtectedRoute>
          }
        />

        {/* Catch All */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
