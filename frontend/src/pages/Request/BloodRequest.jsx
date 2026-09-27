import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../utils/api.js";

const statusStyles = {
  PENDING: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-700",
  },
  MATCHED: {
    label: "Matched",
    className: "bg-blue-100 text-blue-700",
  },
  APPROVED: {
    label: "Approved",
    className: "bg-green-100 text-green-700",
  },
  FULFILLED: {
    label: "Fulfilled",
    className: "bg-emerald-100 text-emerald-700",
  },
  REJECTED: {
    label: "Rejected",
    className: "bg-red-100 text-red-700",
  },
};

const urgencyStyles = {
  NORMAL: "bg-secondary text-muted-foreground",
  URGENT: "bg-orange-100 text-orange-700",
  CRITICAL: "bg-red-100 text-red-700",
};

const bloodTypeLabels = {
  A_POSITIVE: "A+",
  A_NEGATIVE: "A-",
  B_POSITIVE: "B+",
  B_NEGATIVE: "B-",
  AB_POSITIVE: "AB+",
  AB_NEGATIVE: "AB-",
  O_POSITIVE: "O+",
  O_NEGATIVE: "O-",
};

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

function StatusBadge({ status }) {
  const style = statusStyles[status] || {
    label: status || "Unknown",
    className: "bg-secondary text-muted-foreground",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${style.className}`}
    >
      {style.label}
    </span>
  );
}

function UrgencyBadge({ urgency }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
        urgencyStyles[urgency] || "bg-secondary text-muted-foreground"
      }`}
    >
      {urgency || "—"}
    </span>
  );
}

export default function BloodRequest() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const fetchRequests = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.getMyRequests();

        const requestData =
          response?.data?.items ||
          response?.data?.requests ||
          response?.data ||
          [];

        if (isMounted) {
          setRequests(Array.isArray(requestData) ? requestData : []);
        }
      } catch (err) {
        console.error("Failed to load blood requests:", err);

        if (isMounted) {
          setError(
            err?.message ||
              "Unable to load your blood requests. Please try again.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchRequests();

    return () => {
      isMounted = false;
    };
  }, [reloadKey]);

  const handleRetry = () => {
    setReloadKey((currentKey) => currentKey + 1);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Blood Requests
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            View and track blood requests submitted by your hospital.
          </p>
        </div>

        <Link
          to="/requests/new"
          className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          + New Request
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span>{error}</span>

            <button
              type="button"
              onClick={handleRetry}
              className="font-medium underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="overflow-hidden rounded-xl bg-card shadow-lg">
          {/* Desktop Loading Table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/40">
                  {[
                    "Blood Type",
                    "Urgency",
                    "Units",
                    "Patient",
                    "Status",
                    "Date",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {[1, 2, 3, 4].map((item) => (
                  <tr key={item} className="border-b border-border">
                    {[1, 2, 3, 4, 5, 6].map((cell) => (
                      <td key={cell} className="px-6 py-5">
                        <div className="h-4 w-20 animate-pulse rounded bg-secondary" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Loading Cards */}
          <div className="space-y-4 p-4 md:hidden">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="space-y-3 rounded-lg border border-border p-4"
              >
                <div className="h-5 w-20 animate-pulse rounded bg-secondary" />
                <div className="h-4 w-32 animate-pulse rounded bg-secondary" />
                <div className="h-4 w-24 animate-pulse rounded bg-secondary" />
              </div>
            ))}
          </div>
        </div>
      ) : requests.length === 0 ? (
        /* Empty State */
        <div className="rounded-xl bg-card px-6 py-14 text-center shadow-lg">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-2xl">
            🩸
          </div>

          <h2 className="mt-4 text-lg font-semibold text-foreground">
            No blood requests yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Your hospital has not submitted any blood requests. Create a new
            request when blood is needed.
          </p>

          <Link
            to="/requests/new"
            className="mt-6 inline-flex rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Create Blood Request
          </Link>
        </div>
      ) : (
        /* Requests */
        <div className="overflow-hidden rounded-xl bg-card shadow-lg">
          {/* Desktop Table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/40">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Blood Type
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Urgency
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Units
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Patient
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {requests.map((request) => (
                  <tr
                    key={request.id}
                    className="border-b border-border last:border-0 hover:bg-secondary/20"
                  >
                    <td className="px-6 py-5">
                      <span className="font-semibold text-foreground">
                        {bloodTypeLabels[request.bloodType] ||
                          request.bloodType ||
                          "—"}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <UrgencyBadge urgency={request.urgency} />
                    </td>

                    <td className="px-6 py-5 text-sm text-foreground">
                      {request.unitsNeeded ?? "—"}
                    </td>

                    <td className="px-6 py-5">
                      <div className="text-sm font-medium text-foreground">
                        {request.patientName || "—"}
                      </div>

                      {(request.patientAge || request.patientGender) && (
                        <div className="mt-1 text-xs text-muted-foreground">
                          {request.patientAge
                            ? `${request.patientAge} years`
                            : ""}

                          {request.patientAge && request.patientGender
                            ? " • "
                            : ""}

                          {request.patientGender || ""}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-5">
                      <StatusBadge status={request.status} />
                    </td>

                    <td className="px-6 py-5 text-sm text-muted-foreground">
                      {formatDate(request.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="space-y-4 p-4 md:hidden">
            {requests.map((request) => (
              <div
                key={request.id}
                className="rounded-lg border border-border p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-foreground">
                      {bloodTypeLabels[request.bloodType] ||
                        request.bloodType ||
                        "—"}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDate(request.createdAt)}
                    </p>
                  </div>

                  <StatusBadge status={request.status} />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Urgency</p>

                    <div className="mt-1">
                      <UrgencyBadge urgency={request.urgency} />
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Units</p>

                    <p className="mt-1 text-sm font-medium text-foreground">
                      {request.unitsNeeded ?? "—"}
                    </p>
                  </div>

                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground">Patient</p>

                    <p className="mt-1 text-sm font-medium text-foreground">
                      {request.patientName || "—"}
                    </p>

                    {(request.patientAge || request.patientGender) && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {request.patientAge
                          ? `${request.patientAge} years`
                          : ""}

                        {request.patientAge && request.patientGender
                          ? " • "
                          : ""}

                        {request.patientGender || ""}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      {!loading && requests.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl bg-card p-4 shadow-sm">
            <p className="text-xs text-muted-foreground">Total Requests</p>

            <p className="mt-1 text-2xl font-semibold text-foreground">
              {requests.length}
            </p>
          </div>

          <div className="rounded-xl bg-card p-4 shadow-sm">
            <p className="text-xs text-muted-foreground">Pending</p>

            <p className="mt-1 text-2xl font-semibold text-yellow-600">
              {
                requests.filter((request) => request.status === "PENDING")
                  .length
              }
            </p>
          </div>

          <div className="rounded-xl bg-card p-4 shadow-sm">
            <p className="text-xs text-muted-foreground">Matched</p>

            <p className="mt-1 text-2xl font-semibold text-blue-600">
              {
                requests.filter((request) => request.status === "MATCHED")
                  .length
              }
            </p>
          </div>

          <div className="rounded-xl bg-card p-4 shadow-sm">
            <p className="text-xs text-muted-foreground">Fulfilled</p>

            <p className="mt-1 text-2xl font-semibold text-emerald-600">
              {
                requests.filter((request) => request.status === "FULFILLED")
                  .length
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
