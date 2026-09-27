import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { api } from "../../utils/api";

const icons = {
  users: (
    <svg
      width="20"
      height="20"
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

  donors: (
    <svg
      width="20"
      height="20"
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

  hospitals: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 21h18" />
      <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
      <path d="M9 7h2M13 7h2M9 11h2M13 11h2" />
      <path d="M10 21v-5h4v5" />
    </svg>
  ),

  admins: (
    <svg
      width="20"
      height="20"
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

  requests: (
    <svg
      width="20"
      height="20"
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
      width="20"
      height="20"
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

  warning: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10.3 3.9L2.2 18a2 2 0 0 0 1.7 3h16.2a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  ),

  arrow: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  ),

  plus: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),

  bell: (
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
};

const statusStyles = {
  ACTIVE: "bg-green-500/10 text-green-600",
  INACTIVE: "bg-red-500/10 text-red-600",
};

const SuperAdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          usersResponse,
          requestsResponse,
          inventoryResponse,
          notificationsResponse,
        ] = await Promise.all([
          api.getUsers(1, 50),
          api.getAllRequests(1, 10),
          api.getInventory(),
          api.getNotifications(1, 5),
        ]);

        setUsers(usersResponse.data?.items || []);
        setRequests(requestsResponse.data?.items || []);
        setInventory(inventoryResponse.data?.items || []);
        setNotifications(notificationsResponse.data?.items || []);
      } catch (error) {
        setError(error?.message || "Unable to load the super admin dashboard.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const donors = users.filter((currentUser) => currentUser.role === "DONOR");

  const hospitals = users.filter(
    (currentUser) => currentUser.role === "HOSPITAL",
  );

  const admins = users.filter((currentUser) => currentUser.role === "ADMIN");

  const pendingRequests = requests.filter(
    (request) => request.status === "PENDING",
  );

  const inactiveAdmins = admins.filter((admin) => admin.isActive === false);

  const lowInventory = inventory.filter((item) => {
    const units = item.unitsAvailable ?? item.units ?? item.quantity ?? 0;

    return units <= 3;
  });

  const unreadNotifications = notifications.filter(
    (notification) => !notification.isRead,
  ).length;

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-7 w-64 bg-muted rounded-lg" />
          <div className="h-4 w-96 bg-muted rounded-lg" />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-28 bg-muted rounded-xl" />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 h-64 bg-muted rounded-xl" />
            <div className="h-64 bg-muted rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Welcome */}
      <section>
        <h2 className="text-xl sm:text-2xl font-bold font-display text-foreground">
          Welcome back, {user?.firstName}
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Here's an overview of the BloodLink platform.
        </p>
      </section>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Platform statistics */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-card shadow-lg rounded-xl p-4">
          <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            {icons.users}
          </div>

          <p className="mt-3 text-xs text-muted-foreground">Total Users</p>

          <p className="mt-1 text-xl font-bold text-foreground">
            {users.length}
          </p>
        </div>

        <div className="bg-card shadow-lg rounded-xl p-4">
          <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            {icons.donors}
          </div>

          <p className="mt-3 text-xs text-muted-foreground">Donors</p>

          <p className="mt-1 text-xl font-bold text-foreground">
            {donors.length}
          </p>
        </div>

        <div className="bg-card shadow-lg rounded-xl p-4">
          <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            {icons.hospitals}
          </div>

          <p className="mt-3 text-xs text-muted-foreground">Hospitals</p>

          <p className="mt-1 text-xl font-bold text-foreground">
            {hospitals.length}
          </p>
        </div>

        <div className="bg-card shadow-lg rounded-xl p-4">
          <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            {icons.admins}
          </div>

          <p className="mt-3 text-xs text-muted-foreground">Administrators</p>

          <p className="mt-1 text-xl font-bold text-foreground">
            {admins.length}
          </p>
        </div>
      </section>

      {/* Administrative overview */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Admin management */}
        <div className="lg:col-span-2 bg-card shadow-lg rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div>
              <h3 className="text-base font-semibold text-foreground">
                Administrator management
              </h3>

              <p className="mt-0.5 text-xs text-muted-foreground">
                Manage administrators who oversee BloodLink operations.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/admin/admins")}
              className="text-xs font-medium text-primary hover:underline"
            >
              Manage all
            </button>
          </div>

          {admins.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <div className="mx-auto w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                {icons.admins}
              </div>

              <p className="mt-3 text-sm font-medium text-foreground">
                No administrators found
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Create an administrator account to delegate system operations.
              </p>

              <button
                type="button"
                onClick={() => navigate("/admin/admins")}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              >
                {icons.plus}
                Manage Administrators
              </button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {admins.slice(0, 5).map((admin) => (
                <div
                  key={admin.id}
                  className="px-5 py-3.5 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-xs font-bold">
                      {admin.firstName?.[0]}
                      {admin.lastName?.[0]}
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {admin.firstName} {admin.lastName}
                      </p>

                      <p className="text-xs text-muted-foreground truncate">
                        {admin.email}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 px-2 py-1 rounded-full text-[10px] font-medium ${
                      admin.isActive === false
                        ? statusStyles.INACTIVE
                        : statusStyles.ACTIVE
                    }`}
                  >
                    {admin.isActive === false ? "Inactive" : "Active"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* System attention */}
        <div className="bg-card shadow-lg rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-yellow-500/10 text-yellow-600 flex items-center justify-center">
                {icons.warning}
              </div>

              <div>
                <h3 className="text-base font-semibold text-foreground">
                  Needs attention
                </h3>

                <p className="text-xs text-muted-foreground">
                  Areas requiring review.
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-border">
            <button
              type="button"
              onClick={() => navigate("/admin/requests")}
              className="w-full px-5 py-4 flex items-center justify-between gap-3 text-left hover:bg-muted transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-foreground">
                  Pending requests
                </p>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  Awaiting administrative action
                </p>
              </div>

              <span className="text-sm font-bold text-foreground">
                {pendingRequests.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin/inventory")}
              className="w-full px-5 py-4 flex items-center justify-between gap-3 text-left hover:bg-muted transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-foreground">
                  Low inventory
                </p>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  Blood types with low stock
                </p>
              </div>

              <span className="text-sm font-bold text-foreground">
                {lowInventory.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin/admins")}
              className="w-full px-5 py-4 flex items-center justify-between gap-3 text-left hover:bg-muted transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-foreground">
                  Inactive admins
                </p>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  Administrator accounts currently inactive
                </p>
              </div>

              <span className="text-sm font-bold text-foreground">
                {inactiveAdmins.length}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Platform activity */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Blood inventory */}
        <div className="bg-card shadow-lg rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div>
              <h3 className="text-base font-semibold text-foreground">
                Blood inventory
              </h3>

              <p className="mt-0.5 text-xs text-muted-foreground">
                Current system stock.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/admin/inventory")}
              className="text-xs font-medium text-primary hover:underline"
            >
              Manage
            </button>
          </div>

          {inventory.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <div className="mx-auto w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                {icons.inventory}
              </div>

              <p className="mt-3 text-sm font-medium text-foreground">
                No inventory data
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 p-5">
              {inventory.slice(0, 8).map((item) => {
                const units =
                  item.unitsAvailable ?? item.units ?? item.quantity ?? 0;

                return (
                  <div
                    key={item.bloodType}
                    className="rounded-lg border border-border p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-foreground">
                        {item.bloodType}
                      </span>

                      <span className="text-xs text-muted-foreground">
                        {units}
                      </span>
                    </div>

                    <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          units <= 3 ? "bg-yellow-500" : "bg-primary"
                        }`}
                        style={{
                          width: `${Math.min((units / 20) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent users */}
        <div className="bg-card shadow-lg rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div>
              <h3 className="text-base font-semibold text-foreground">
                Recent users
              </h3>

              <p className="mt-0.5 text-xs text-muted-foreground">
                Recent platform registrations.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/admin/users")}
              className="text-xs font-medium text-primary hover:underline"
            >
              View all
            </button>
          </div>

          {users.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <p className="text-sm text-muted-foreground">No users found.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {users.slice(0, 5).map((currentUser) => (
                <div
                  key={currentUser.id}
                  className="px-5 py-3 flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-[10px] font-bold">
                    {currentUser.firstName?.[0]}
                    {currentUser.lastName?.[0]}
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">
                      {currentUser.firstName} {currentUser.lastName}
                    </p>

                    <p className="text-[10px] text-muted-foreground">
                      {currentUser.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="bg-card shadow-lg rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div>
              <h3 className="text-base font-semibold text-foreground">
                Notifications
              </h3>

              <p className="mt-0.5 text-xs text-muted-foreground">
                Recent system updates.
              </p>
            </div>

            {unreadNotifications > 0 && (
              <span className="text-[10px] font-medium text-primary">
                {unreadNotifications} unread
              </span>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <div className="mx-auto w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                {icons.bell}
              </div>

              <p className="mt-3 text-sm font-medium text-foreground">
                No notifications
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.slice(0, 4).map((notification) => (
                <div
                  key={notification.id}
                  className="px-5 py-3.5 flex items-start gap-3"
                >
                  <div className="mt-0.5 w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    {icons.bell}
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-medium text-foreground">
                      {notification.title}
                    </p>

                    <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2">
                      {notification.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="px-5 py-3 border-t border-border">
            <button
              type="button"
              onClick={() => navigate("/notifications")}
              className="text-xs font-medium text-primary hover:underline"
            >
              View notifications
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SuperAdminDashboard;
