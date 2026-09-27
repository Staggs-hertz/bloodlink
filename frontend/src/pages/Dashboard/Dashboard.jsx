import { useAuth } from "../../context/AuthContext";
import DonorDashboard from "./DonorDashboard";
import HospitalDashboard from "./HospitalDashboard";
import AdminDashboard from "./AdminDashboard";
import SuperAdminDashboard from "./SuperAdminDashboard";

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case "DONOR":
      return <DonorDashboard />;

    case "HOSPITAL":
      return <HospitalDashboard />;

    case "ADMIN":
      return <AdminDashboard />;

    case "SUPER_ADMIN":
      return <SuperAdminDashboard />;

    default:
      return null;
  }
};

export default Dashboard;
