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

  bell: (
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
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
};

const statusStyles = {
  PENDING: "bg-yellow-500/10 text-yellow-600",
  MATCHED: "bg-primary/10 text-primary",
  APPROVED: "bg-green-500/10 text-green-600",
  REJECTED: "bg-red-500/10 text-red-600",
  FULFILLED: "bg-primary/10 text-primary",
};

const formatStatus = (status) => {
  if (!status) return "Unknown";

  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [requests, setRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const [summaryResponse, requestsResponse, notificationsResponse] =
          await Promise.all([
            api.getAdminDashboardSummary(),
            api.getAllRequests(1, 10),
            api.getNotifications(1, 5),
          ]);

        setSummary(summaryResponse.data);

        setRequests(
          requestsResponse.data?.items || requestsResponse.data || [],
        );

        setNotifications(
          notificationsResponse.data?.items ||
            notificationsResponse.data?.notifications ||
            notificationsResponse.data ||
            [],
        );
      } catch (error) {
        setError(error?.message || "Unable to load the admin dashboard.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const pendingRequests = requests.filter(
    (request) => request.status === "PENDING",
  );

  const inventory = summary?.inventory?.items || [];

  const lowInventory = inventory.filter(
    (item) =>
      item.unitsAvailable <= (summary?.inventory?.lowStockThreshold ?? 3),
  );

  const unreadNotifications = notifications.filter(
    (notification) => notification.status === "SENT",
  ).length;

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-7 w-60 bg-muted rounded-lg" />
          <div className="h-4 w-80 bg-muted rounded-lg" />

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
          Here's an overview of BloodLink's current operations.
        </p>
      </section>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Overview statistics */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total users */}
        <div className="bg-card shadow-lg rounded-xl p-4">
          <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            {icons.users}
          </div>

          <p className="mt-3 text-xs text-muted-foreground">Total Users</p>

          <p className="mt-1 text-xl font-bold text-foreground">
            {summary?.users?.total ?? 0}
          </p>
        </div>

        {/* Donors */}
        <div className="bg-card shadow-lg rounded-xl p-4">
          <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            {icons.donors}
          </div>

          <p className="mt-3 text-xs text-muted-foreground">Donors</p>

          <p className="mt-1 text-xl font-bold text-foreground">
            {summary?.donors?.total ?? 0}
          </p>
        </div>

        {/* Hospitals */}
        <div className="bg-card shadow-lg rounded-xl p-4">
          <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            {icons.hospitals}
          </div>

          <p className="mt-3 text-xs text-muted-foreground">Hospitals</p>

          <p className="mt-1 text-xl font-bold text-foreground">
            {summary?.hospitals?.total ?? 0}
          </p>
        </div>

        {/* Pending requests */}
        <div className="bg-card shadow-lg rounded-xl p-4">
          <div className="w-9 h-9 rounded-lg bg-yellow-500/10 text-yellow-600 flex items-center justify-center">
            {icons.requests}
          </div>

          <p className="mt-3 text-xs text-muted-foreground">Pending Requests</p>

          <p className="mt-1 text-xl font-bold text-foreground">
            {summary?.requests?.pending ?? 0}
          </p>
        </div>
      </section>

      {/* Requests + Inventory alerts */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Pending requests */}
        <div className="lg:col-span-2 bg-card shadow-lg rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div>
              <h3 className="text-base font-semibold text-foreground">
                Pending blood requests
              </h3>

              <p className="mt-0.5 text-xs text-muted-foreground">
                Requests waiting for administrative action.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/admin/requests")}
              className="text-xs font-medium text-primary hover:underline"
            >
              View all
            </button>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <div className="mx-auto w-10 h-10 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center">
                {icons.requests}
              </div>

              <p className="mt-3 text-sm font-medium text-foreground">
                No pending requests
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                There are currently no requests waiting for review.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {pendingRequests.slice(0, 5).map((request) => (
                <div
                  key={request.id}
                  className="px-5 py-4 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">
                      {request.bloodType || "Blood request"}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground truncate">
                      {request.hospital?.organizationName ||
                        request.hospital?.firstName ||
                        "Hospital"}{" "}
                      · {request.unitsNeeded} unit
                      {request.unitsNeeded !== 1 ? "s" : ""}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-medium ${
                      statusStyles[request.status] ||
                      "bg-muted text-muted-foreground"
                    }`}
                  >
                    {formatStatus(request.status)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Inventory alerts */}
        <div className="bg-card shadow-lg rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-yellow-500/10 text-yellow-600 flex items-center justify-center">
                {icons.warning}
              </div>

              <div>
                <h3 className="text-base font-semibold text-foreground">
                  Inventory alerts
                </h3>

                <p className="text-xs text-muted-foreground">
                  Blood types with low stock.
                </p>
              </div>
            </div>
          </div>

          {lowInventory.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <p className="text-sm font-medium text-foreground">
                No low-stock alerts
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Current inventory is above the alert threshold.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {lowInventory.slice(0, 6).map((item) => {
                const units = item.unitsAvailable;

                return (
                  <div
                    key={item.bloodType}
                    className="px-5 py-3.5 flex items-center justify-between"
                  >
                    <span className="text-sm font-semibold text-foreground">
                      {item.bloodType}
                    </span>

                    <span className="text-xs font-medium text-yellow-600">
                      {units} {units === 1 ? "unit" : "units"}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          <div className="px-5 py-3 border-t border-border">
            <button
              type="button"
              onClick={() => navigate("/admin/inventory")}
              className="text-xs font-medium text-primary hover:underline"
            >
              Manage inventory
            </button>
          </div>
        </div>
      </section>

      {/* Users + notifications */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent users */}
        <div className="lg:col-span-2 bg-card shadow-lg rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div>
              <h3 className="text-base font-semibold text-foreground">
                Recent users
              </h3>

              <p className="mt-0.5 text-xs text-muted-foreground">
                Recently registered BloodLink users.
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

          <div className="px-5 py-8 text-center">
            {summary?.users?.total === 0 ? (
              <p className="text-sm font-medium text-foreground">
                No users found
              </p>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  {summary?.users?.total ?? 0} registered user
                  {(summary?.users?.total ?? 0) !== 1 ? "s" : ""} currently
                  exist in BloodLink.
                </p>

                <button
                  type="button"
                  onClick={() => navigate("/admin/users")}
                  className="mt-3 text-xs font-medium text-primary hover:underline"
                >
                  Open users
                </button>
              </>
            )}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-card shadow-lg rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div>
              <h3 className="text-base font-semibold text-foreground">
                Notifications
              </h3>

              <p className="mt-0.5 text-xs text-muted-foreground">
                Recent administrative updates.
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
                      {notification.status === "SENT"
                        ? "New notification"
                        : "Notification"}
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

export default AdminDashboard;
