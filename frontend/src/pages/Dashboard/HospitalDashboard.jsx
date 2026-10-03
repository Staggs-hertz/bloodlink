import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { api } from "../../utils/api";

const icons = {
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

  pending: (
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
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  ),

  approved: (
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
      <path d="M20 6L9 17l-5-5" />
    </svg>
  ),

  rejected: (
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
      <circle cx="12" cy="12" r="9" />
      <path d="M15 9l-6 6M9 9l6 6" />
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
  PENDING: "bg-yellow-500/10 text-yellow-600",
  MATCHED: "bg-blue-500/10 text-blue-600",
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

const HospitalDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [requestSummary, setRequestSummary] = useState({
    total: 0,
    pending: 0,
    matched: 0,
    approved: 0,
    fulfilled: 0,
    rejected: 0,
  });

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
          requestsResponse,
          requestSummaryResponse,
          inventoryResponse,
          notificationsResponse,
        ] = await Promise.all([
          api.getMyRequests(1, 5),
          api.getMyRequestSummary(),
          api.getInventory(),
          api.getNotifications(1, 5),
        ]);

        setRequests(
          Array.isArray(requestsResponse.data) ? requestsResponse.data : [],
        );

        setRequestSummary(
          requestSummaryResponse.data || {
            total: 0,
            pending: 0,
            matched: 0,
            approved: 0,
            fulfilled: 0,
            rejected: 0,
          },
        );

        setInventory(
          Array.isArray(inventoryResponse.data) ? inventoryResponse.data : [],
        );

        setNotifications(
          Array.isArray(notificationsResponse.data)
            ? notificationsResponse.data
            : [],
        );
      } catch (error) {
        setError(error?.message || "Unable to load your dashboard.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const unreadNotifications = notifications.filter(
    (notification) => notification.status === "SENT",
  ).length;

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-7 w-64 bg-muted rounded-lg" />
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
          Here's an overview of your hospital's blood requests.
        </p>
      </section>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Request statistics */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-card shadow-lg rounded-xl p-4">
          <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            {icons.requests}
          </div>

          <p className="mt-3 text-xs text-muted-foreground">Total Requests</p>

          <p className="mt-1 text-xl font-bold text-foreground">
            {requests.total}
          </p>
        </div>

        <div className="bg-card shadow-lg rounded-xl p-4">
          <div className="w-9 h-9 rounded-lg bg-yellow-500/10 text-yellow-600 flex items-center justify-center">
            {icons.pending}
          </div>

          <p className="mt-3 text-xs text-muted-foreground">Pending</p>

          <p className="mt-1 text-xl font-bold text-foreground">
            {requestSummary.pending}
          </p>
        </div>

        <div className="bg-card shadow-lg rounded-xl p-4">
          <div className="w-9 h-9 rounded-lg bg-green-500/10 text-green-600 flex items-center justify-center">
            {icons.approved}
          </div>

          <p className="mt-3 text-xs text-muted-foreground">Approved</p>

          <p className="mt-1 text-xl font-bold text-foreground">
            {requestSummary.approved}
          </p>
        </div>

        <div className="bg-card shadow-lg rounded-xl p-4">
          <div className="w-9 h-9 rounded-lg bg-red-500/10 text-red-600 flex items-center justify-center">
            {icons.rejected}
          </div>

          <p className="mt-3 text-xs text-muted-foreground">Rejected</p>

          <p className="mt-1 text-xl font-bold text-foreground">
            {requestSummary.rejected}
          </p>
        </div>
      </section>

      {/* Main dashboard area */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent requests */}
        <div className="lg:col-span-2 bg-card shadow-lg rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div>
              <h3 className="text-base font-semibold text-foreground">
                Recent requests
              </h3>

              <p className="mt-0.5 text-xs text-muted-foreground">
                Your most recent blood requests.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/blood-requests")}
              className="text-xs font-medium text-primary hover:underline"
            >
              View all
            </button>
          </div>

          {requests.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <div className="mx-auto w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                {icons.requests}
              </div>

              <p className="mt-3 text-sm font-medium text-foreground">
                No blood requests yet
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Create a request when your hospital needs blood.
              </p>

              <button
                type="button"
                onClick={() => navigate("/blood-requests/new")}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              >
                {icons.plus}
                New Request
              </button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {requests.slice(0, 5).map((request) => (
                <div
                  key={request.id}
                  className="px-5 py-4 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">
                      {request.bloodType || "Blood request"}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {request.unitsNeeded ?? "—"} unit
                      {(request.unitsNeeded ?? 0) !== 1 ? "s" : ""}
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

        {/* Quick request */}
        <div className="bg-card shadow-lg rounded-xl p-5">
          <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            {icons.requests}
          </div>

          <h3 className="mt-4 text-base font-semibold text-foreground">
            Need blood?
          </h3>

          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
            Submit a blood request and let BloodLink process it through the
            matching and approval workflow.
          </p>

          <button
            type="button"
            onClick={() => navigate("/blood-requests/new")}
            className="mt-5 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            {icons.plus}
            Create Blood Request
          </button>
        </div>
      </section>

      {/* Blood availability */}
      <section className="bg-card shadow-lg rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Blood availability
            </h3>

            <p className="mt-0.5 text-xs text-muted-foreground">
              Current blood stock available in the system.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/inventory")}
            className="text-xs font-medium text-primary hover:underline"
          >
            View inventory
          </button>
        </div>

        {inventory.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <div className="mx-auto w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              {icons.inventory}
            </div>

            <p className="mt-3 text-sm font-medium text-foreground">
              Inventory information unavailable
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Blood availability will appear here when inventory data is
              available.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 p-5">
            {inventory.map((item) => {
              const units =
                item.unitsAvailable ?? item.units ?? item.quantity ?? 0;

              return (
                <div
                  key={item.bloodType}
                  className="rounded-lg shadow-lg p-3 text-center"
                >
                  <p className="text-sm font-bold text-foreground">
                    {item.bloodType}
                  </p>

                  <p className="mt-1 text-lg font-bold text-primary">{units}</p>

                  <p className="text-[10px] text-muted-foreground">
                    {units === 1 ? "unit" : "units"}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Notifications */}
      <section className="bg-card shadow-lg rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Recent notifications
            </h3>

            <p className="mt-0.5 text-xs text-muted-foreground">
              Updates related to your hospital account and requests.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {unreadNotifications > 0 && (
              <span className="text-xs text-primary font-medium">
                {unreadNotifications} unread
              </span>
            )}

            <button
              type="button"
              onClick={() => navigate("/notifications")}
              className="text-xs font-medium text-primary hover:underline"
            >
              View all
            </button>
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <div className="mx-auto w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              {icons.bell}
            </div>

            <p className="mt-3 text-sm font-medium text-foreground">
              No notifications yet
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              New request and account updates will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="px-5 py-4 flex items-start gap-3"
              >
                <div className="mt-0.5 w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  {icons.bell}
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {notification.title}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {notification.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HospitalDashboard;
