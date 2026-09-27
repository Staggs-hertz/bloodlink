import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/requests": "Blood Requests",
  "/requests/new": "New Blood Request",
  "/notifications": "Notifications",
  "/profile": "My Profile",
  "/admin/requests": "Blood Requests",
  "/admin/donors": "Donors",
  "/admin/inventory": "Blood Inventory",
  "/admin/users": "User Management",
  "/admin/admins": "Manage Admins",
};

export default function Topbar() {
  const { user, logout } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const title = pageTitles[location.pathname] || "BloodLink";

  const initials = `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`;

  const greetingHour = new Date().getHours();

  const greeting =
    greetingHour < 12
      ? "Good morning"
      : greetingHour < 17
        ? "Good afternoon"
        : "Good evening";

  const dateStr = new Date().toLocaleDateString("en-NG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleLogout = async () => {
    setDropdownOpen(false);

    await logout();

    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur px-6 py-3 flex items-center justify-between gap-4">
      {/* Left — page title */}
      <div>
        <h1 className="text-lg font-bold font-display text-foreground leading-tight">
          {title}
        </h1>

        <p className="text-xs text-muted-foreground hidden sm:block">
          {dateStr}
        </p>
      </div>

      {/* Right — greeting, notifications, avatar */}
      <div className="flex items-center gap-3">
        <span className="hidden lg:block text-sm text-muted-foreground">
          {greeting},{" "}
          <span className="font-semibold text-foreground">
            {user?.firstName}
          </span>
        </span>

        {/* Notification bell */}
        <button
          type="button"
          onClick={() => navigate("/notifications")}
          className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
          aria-label="Notifications"
        >
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

          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
        </button>

        {/* Avatar dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen((open) => !open)}
            className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-sm hover:bg-primary/25 transition-colors"
            aria-label="Open user menu"
          >
            {initials}
          </button>

          {dropdownOpen && (
            <>
              {/* Click outside to close dropdown */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setDropdownOpen(false)}
              />

              <div className="absolute right-0 top-11 z-20 w-48 bg-card border border-border rounded-xl shadow-lg py-1 overflow-hidden">
                {/* User information */}
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-sm font-semibold text-foreground">
                    {user?.firstName} {user?.lastName}
                  </p>

                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email}
                  </p>
                </div>

                {/* Profile */}
                <button
                  type="button"
                  onClick={() => {
                    navigate("/profile");
                    setDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                >
                  Profile
                </button>

                {/* Logout */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                >
                  Log out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
