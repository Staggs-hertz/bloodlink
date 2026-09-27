import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const icons = {
  home: (
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
      <path d="M3 10.5L12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M9 21v-6h6v6" />
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
};

const navByRole = {
  DONOR: [
    { label: "Home", to: "/dashboard", icon: "home" },
    { label: "Donations", to: "/donations", icon: "donations" },
    { label: "Alerts", to: "/notifications", icon: "notifications" },
    { label: "Profile", to: "/profile", icon: "profile" },
  ],

  HOSPITAL: [
    { label: "Home", to: "/dashboard", icon: "home" },
    { label: "Requests", to: "/requests", icon: "requests" },
    { label: "New Request", to: "/requests/new", icon: "requests" },
    { label: "Alerts", to: "/notifications", icon: "notifications" },
    { label: "Profile", to: "/profile", icon: "profile" },
  ],

  ADMIN: [
    { label: "Home", to: "/dashboard", icon: "home" },
    { label: "Users", to: "/admin/users", icon: "users" },
    { label: "Requests", to: "/admin/requests", icon: "requests" },
    { label: "Inventory", to: "/admin/inventory", icon: "inventory" },
    { label: "Alerts", to: "/notifications", icon: "notifications" },
  ],

  SUPER_ADMIN: [
    { label: "Home", to: "/dashboard", icon: "home" },
    { label: "Users", to: "/admin/users", icon: "users" },
    { label: "Requests", to: "/admin/requests", icon: "requests" },
    { label: "Admins", to: "/admin/admins", icon: "shield" },
    { label: "Profile", to: "/profile", icon: "profile" },
  ],
};

export default function MobileNav() {
  const { user } = useAuth();

  const tabs = navByRole[user?.role] || navByRole.DONOR;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0D0D0D] border-t border-white/10 flex">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) =>
            `relative flex-1 flex flex-col items-center justify-center py-3 gap-0.5 transition-colors ${
              isActive ? "text-primary" : "text-white/40"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span className="leading-none">{icons[tab.icon]}</span>

              <span className="text-[10px] font-medium">{tab.label}</span>

              {isActive && (
                <span className="absolute top-0 w-6 h-0.5 bg-primary rounded-b-full" />
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
