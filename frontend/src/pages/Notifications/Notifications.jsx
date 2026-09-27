import { useCallback, useEffect, useState } from "react";
import { api } from "../../utils/api";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.getNotifications();

      setNotifications(response.data?.notifications || []);
    } catch (err) {
      setError(err.message || "Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadNotifications();
    }, 0);

    return () => clearTimeout(timer);
  }, [loadNotifications]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await api.markNotificationAsRead(notificationId);

      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, status: "READ" }
            : notification,
        ),
      );
    } catch (err) {
      setError(err.message || "Failed to mark notification as read.");
    }
  };

  const unreadCount = notifications.filter(
    (notification) => notification.status === "SENT",
  ).length;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-full bg-card shadow-lg px-4 py-6 text-gray-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.7}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9a6 6 0 0 0-12 0v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.084 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                  />
                </svg>
              </div>

              <span className="text-sm font-medium text-primary">Updates</span>
            </div>

            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Notifications
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Stay updated with important messages and activity related to your
              BloodLink account.
            </p>
          </div>

          {unreadCount > 0 && (
            <div className="w-fit rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
              {unreadCount} unread
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 flex flex-col gap-3 rounded-xl border border-red-400/15 bg-red-400/4 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-red-300">{error}</p>

            <button
              type="button"
              onClick={loadNotifications}
              className="w-fit rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-primary transition hover:border-primary/20 hover:bg-white/5"
            >
              Try again
            </button>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-xl border border-white/5 bg-white/2 p-5"
              >
                <div className="mb-3 h-3 w-20 rounded bg-white/10" />
                <div className="mb-2 h-4 w-3/4 rounded bg-white/10" />
                <div className="h-3 w-1/3 rounded bg-white/10" />
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          /* Empty State */
          <div className="flex min-h-80 flex-col items-center justify-center rounded-xl border border-white/5 bg-white/2 px-6 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/5 text-white/35">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-7 w-7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9a6 6 0 0 0-12 0v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.084 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                />
              </svg>
            </div>

            <h2 className="text-base font-medium text-primary">
              No notifications yet
            </h2>

            <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
              Important updates about your BloodLink account and activities will
              appear here.
            </p>
          </div>
        ) : (
          /* Notification List */
          <div className="space-y-3">
            {notifications.map((notification) => {
              const isUnread = notification.status === "SENT";

              return (
                <div
                  key={notification.id}
                  className={`rounded-xl border p-5 transition ${
                    isUnread
                      ? "border-primary/15 bg-primary/4"
                      : "border-white/5 bg-white/2"
                  }`}
                >
                  <div className="flex gap-4">
                    <div
                      className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                        isUnread
                          ? "bg-primary/10 text-primary"
                          : "bg-white/5 text-white/30"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.7}
                        stroke="currentColor"
                        className="h-4 w-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9a6 6 0 0 0-12 0v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.084 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                        />
                      </svg>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <p
                          className={`text-sm leading-6 ${
                            isUnread
                              ? "font-medium text-white"
                              : "text-white/65"
                          }`}
                        >
                          {notification.message}
                        </p>

                        {isUnread && (
                          <span className="w-fit shrink-0 rounded-full bg-primary/10 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-primary">
                            New
                          </span>
                        )}
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/30">
                        <span>{formatDate(notification.createdAt)}</span>
                        <span className="text-white/15">•</span>
                        <span>{formatTime(notification.createdAt)}</span>

                        {isUnread && (
                          <>
                            <span className="text-white/15">•</span>

                            <button
                              type="button"
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="font-medium text-primary transition hover:text-primary/80"
                            >
                              Mark as read
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
