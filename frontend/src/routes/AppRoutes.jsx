import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Public Pages
import PageNotFound from "../pages/PageNotFound";
import Home from "../pages/Home/Home";
import Login from "../pages/Form/Login";
import Register from "../pages/Form/Register";
import FAQPage from "../pages/FAQs/FAQPage";
import About from "../pages/About/About";
import MedicalGuidelines from "../pages/Support/MedicalGuidelines";
import EmergencyContacts from "../pages/Support/EmergencyContacts";
import HelpCenter from "../pages/Support/HelpCenter";
import TermsOfService from "../pages/Support/TermsOfService";
import PrivacyPolicy from "../pages/Support/PrivacyPolicy";
import VerifyEmail from "../pages/verifyEmail";

// Dashboard Pages
import Dashboard from "../pages/Dashboard/Dashboard";
import Notifications from "../pages/Notifications/Notifications";
import Profile from "../pages/Dashboard/Profile";
// import MyDonations from "../pages/Dashboard/MyDonations";
import BloodRequest from "../pages/Request/BloodRequest";
import CreateBloodRequest from "../pages/Request/CreateBloodRequest";
import Inventory from "../pages/Dashboard/Inventory";

// Admin Pages
import Users from "../pages/Dashboard/Users";
import Donors from "../pages/Dashboard/Donors";
import AdminBloodRequests from "../pages/Request/AdminBloodRequests";
import ManageAdmins from "../pages/Dashboard/ManageAdmins";

// Layout
import DashboardLayout from "../layouts/DashboardLayout";

// Protects routes that require authentication.
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Protects routes based on the user's role.
const RoleRoute = ({ allowedRoles, children }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* ========== Public Routes ========== */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/faq" element={<FAQPage />} />
      <Route path="/medical-guidelines" element={<MedicalGuidelines />} />
      <Route path="/emergency-contacts" element={<EmergencyContacts />} />
      <Route path="/help" element={<HelpCenter />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* ========== Protected Routes ========== */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route
          path="/profile"
          element={
            <RoleRoute allowedRoles={["DONOR", "HOSPITAL"]}>
              <Profile />
            </RoleRoute>
          }
        />
        {/* <Route
          path="/donations"
          element={
            <RoleRoute allowedRoles={["DONOR"]}>
              <MyDonations />
            </RoleRoute>
          }
        /> */}
        <Route
          path="/requests"
          element={
            <RoleRoute allowedRoles={["HOSPITAL"]}>
              <BloodRequest />
            </RoleRoute>
          }
        />

        <Route
          path="/requests/new"
          element={
            <RoleRoute allowedRoles={["HOSPITAL"]}>
              <CreateBloodRequest />
            </RoleRoute>
          }
        />
        <Route
          path="/inventory"
          element={
            <RoleRoute allowedRoles={["HOSPITAL", "ADMIN", "SUPER_ADMIN"]}>
              <Inventory />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <RoleRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
              <Users />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/donors"
          element={
            <RoleRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
              <Donors />
            </RoleRoute>
          }
        />

        <Route
          path="/admin/requests"
          element={
            <RoleRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
              <AdminBloodRequests />
            </RoleRoute>
          }
        />

        <Route
          path="/admin/inventory"
          element={
            <RoleRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
              <Inventory />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/admins"
          element={
            <RoleRoute allowedRoles={["SUPER_ADMIN"]}>
              <ManageAdmins />
            </RoleRoute>
          }
        />
      </Route>

      {/* 404 */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default AppRoutes;
