import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { api } from "../../utils/api";

const icons = {
  blood: (
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

  check: (
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

  profile: (
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
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
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
};

const DonorDashboard = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [donorProfile, setDonorProfile] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingAvailability, setUpdatingAvailability] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const [profileResponse, notificationResponse] = await Promise.all([
          api.getMyDonorProfile(),
          api.getNotifications(1, 5),
        ]);

        setDonorProfile(profileResponse.data);
        setNotifications(notificationResponse.data?.items || []);
      } catch (error) {
        setError(error?.message || "Unable to load your dashboard.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const isAvailable = donorProfile?.isAvailable ?? false;

  const handleAvailabilityChange = async () => {
    try {
      setUpdatingAvailability(true);
      setError("");

      const response = await api.updateAvailability(!isAvailable);

      setDonorProfile((current) => ({
        ...current,
        ...response.data,
        isAvailable: response.data?.isAvailable ?? !isAvailable,
      }));

      if (response.data?.user) {
        updateUser(response.data.user);
      }
    } catch (error) {
      setError(error?.message || "Unable to update your availability.");
    } finally {
      setUpdatingAvailability(false);
    }
  };

  const unreadNotifications = notifications.filter(
    (notification) => !notification.isRead,
  ).length;

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-7 w-56 bg-muted rounded-lg" />
          <div className="h-4 w-72 bg-muted rounded-lg" />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-28 bg-muted rounded-xl" />
            ))}
          </div>

          <div className="h-64 bg-muted rounded-xl" />
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
          Here's an overview of your donor account.
        </p>
      </section>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Overview cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-card shadow-lg rounded-xl p-4">
          <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            {icons.blood}
          </div>

          <p className="mt-3 text-xs text-muted-foreground">Blood Type</p>

          <p className="mt-1 text-xl font-bold text-foreground">
            {donorProfile?.bloodType || "Not set"}
          </p>
        </div>

        <div className="bg-card shadow-lg rounded-xl p-4">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center ${
              isAvailable
                ? "bg-green-500/10 text-green-600"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {icons.check}
          </div>

          <p className="mt-3 text-xs text-muted-foreground">Availability</p>

          <p
            className={`mt-1 text-sm font-semibold ${
              isAvailable ? "text-green-600" : "text-muted-foreground"
            }`}
          >
            {isAvailable ? "Available to donate" : "Currently unavailable"}
          </p>
        </div>

        <div className="bg-card shadow-lg rounded-xl p-4">
          <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            {icons.profile}
          </div>

          <p className="mt-3 text-xs text-muted-foreground">Account</p>

          <p className="mt-1 text-sm font-semibold text-foreground">
            {user?.isEmailVerified ? "Verified" : "Unverified"}
          </p>
        </div>

        <div className="bg-card shadow-lg rounded-xl p-4">
          <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            {icons.bell}
          </div>

          <p className="mt-3 text-xs text-muted-foreground">Notifications</p>

          <p className="mt-1 text-xl font-bold text-foreground">
            {unreadNotifications}
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Donation status */}
        <div className="lg:col-span-2 bg-card shadow-lg rounded-xl p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-foreground">
                Donation status
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Keep your donor availability up to date so BloodLink can
                identify you when your blood type is needed.
              </p>
            </div>

            <div
              className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-medium ${
                isAvailable
                  ? "bg-green-500/10 text-green-600"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {isAvailable ? "Available" : "Unavailable"}
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
            <button
              type="button"
              onClick={handleAvailabilityChange}
              disabled={updatingAvailability}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {updatingAvailability
                ? "Updating..."
                : isAvailable
                  ? "Mark as unavailable"
                  : "I'm available to donate"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg shadow-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              Update profile
              {icons.arrow}
            </button>
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-card shadow-lg rounded-xl p-5">
          <h3 className="text-base font-semibold text-foreground">
            Quick actions
          </h3>

          <div className="mt-4 space-y-2">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="flex items-center justify-between w-full px-3 py-3 rounded-lg hover:bg-muted transition-colors text-left"
            >
              <span className="text-sm text-foreground">
                View donor profile
              </span>

              {icons.arrow}
            </button>

            <button
              type="button"
              onClick={() => navigate("/notifications")}
              className="flex items-center justify-between w-full px-3 py-3 rounded-lg hover:bg-muted transition-colors text-left"
            >
              <span className="text-sm text-foreground">
                View notifications
              </span>

              {icons.arrow}
            </button>
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section className="bg-card shadow-lg rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Recent notifications
            </h3>

            <p className="mt-0.5 text-xs text-muted-foreground">
              Recent updates related to your account.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/notifications")}
            className="text-xs font-medium text-primary hover:underline"
          >
            View all
          </button>
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
              New updates will appear here.
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

export default DonorDashboard;
