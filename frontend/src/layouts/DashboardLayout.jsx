import { Outlet } from "react-router-dom";
import Sidebar from "../pages/Dashboard/Sidebar";
import Topbar from "../pages/Dashboard/Topbar";
import MobileNav from "../pages/Dashboard/MobileNav";

const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-secondary overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto px-4 md:px-6 lg:px-8">
          <div className="p-4 sm:p-6 pb-24 md:pb-6">
            <Outlet />
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
};

export default DashboardLayout;
