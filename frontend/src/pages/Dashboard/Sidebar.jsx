import { useState } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { assets } from "../../assets/assets";

const icons = {
  dashboard: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  ),

  donations: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
    </svg>
  ),

  requests: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z" />
    </svg>
  ),

  inventory: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3h18v4H3zM3 11h18v4H3zM3 19h18v4H3z" />
    </svg>
  ),

  users: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),

  profile: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),

  notifications: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),

  shield: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3L20 6V11C20 16.5 16.5 20.5 12 22C7.5 20.5 4 16.5 4 11V6L12 3Z" />
      <path d="M9 12L11 14L15 10" />
    </svg>
  ),

  logout: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
};

const navByRole = {
  DONOR: [
    { label: "Dashboard", to: "/dashboard", icon: "dashboard" },
    { label: "My Donations", to: "/donations", icon: "donations" },
    { label: "Notifications", to: "/notifications", icon: "notifications" },
    { label: "Profile", to: "/profile", icon: "profile" },
  ],

  HOSPITAL: [
    { label: "Dashboard", to: "/dashboard", icon: "dashboard" },
    { label: "Blood Requests", to: "/requests", icon: "requests" },
    { label: "New Request", to: "/requests/new", icon: "requests" },
    { label: "Notifications", to: "/notifications", icon: "notifications" },
    { label: "Profile", to: "/profile", icon: "profile" },
  ],

  ADMIN: [
    { label: "Dashboard", to: "/dashboard", icon: "dashboard" },
    { label: "Users", to: "/admin/users", icon: "users" },
    { label: "Donors", to: "/admin/donors", icon: "donations" },
    { label: "Blood Requests", to: "/admin/requests", icon: "requests" },
    { label: "Inventory", to: "/admin/inventory", icon: "inventory" },
    { label: "Notifications", to: "/notifications", icon: "notifications" },
  ],

  SUPER_ADMIN: [
    { label: "Dashboard", to: "/dashboard", icon: "dashboard" },
    { label: "Users", to: "/admin/users", icon: "users" },
    { label: "Donors", to: "/admin/donors", icon: "donations" },
    { label: "Blood Requests", to: "/admin/requests", icon: "requests" },
    { label: "Inventory", to: "/admin/inventory", icon: "inventory" },
    { label: "Notifications", to: "/notifications", icon: "notifications" },
    { label: "Manage Admins", to: "/admin/admins", icon: "shield" },
  ],
};

export default function Sidebar() {
  const [expanded, setExpanded] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = navByRole[user?.role] || navByRole.DONOR;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <aside
      className={`hidden md:flex flex-col bg-[#0D0D0D] border-r border-white/5 transition-all duration-300 ${
        expanded ? "w-56" : "w-16"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center shrink-0">
            <img src={assets.logo_icon} alt="" />
          </div>

          {expanded && (
            <span className="text-white font-bold text-base tracking-tight">
              BloodLink
            </span>
          )}
        </Link>

        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className={`ml-auto text-white/30 hover:text-white/70 transition-colors ${
            !expanded && "hidden"
          }`}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      </div>

      {/* Expand button when collapsed */}
      {!expanded && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="flex justify-center py-3 text-white/30 hover:text-white/70 transition-colors"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      )}

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-0.5 px-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group ${
                isActive
                  ? "bg-primary/20 text-primary border-l-2 border-primary"
                  : "text-white/50 hover:text-white hover:bg-white/5 border-l-2 border-transparent"
              }`
            }
          >
            <span className="shrink-0">{icons[item.icon]}</span>

            {expanded && (
              <span className="text-sm font-medium truncate">{item.label}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="border-t border-white/5 p-3">
        {expanded && user && (
          <div className="flex items-center gap-2 px-2 py-2 mb-1">
            <div className="w-7 h-7 rounded-full bg-primary/30 flex items-center justify-center shrink-0">
              <span className="text-primary text-xs font-bold">
                {user.firstName?.[0]}
                {user.lastName?.[0]}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate">
                {user.firstName} {user.lastName}
              </p>

              <p className="text-white/40 text-xs truncate capitalize">
                {user.role?.toLowerCase()}
              </p>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleLogout}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150 ${
            !expanded && "justify-center"
          }`}
        >
          {icons.logout}

          {expanded && <span className="text-sm font-medium">Log out</span>}
        </button>
      </div>
    </aside>
  );
}
