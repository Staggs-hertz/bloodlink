import { useEffect, useMemo, useState } from "react";
import { api } from "../../utils/api.js";

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

const statusStyles = {
  PENDING: "bg-amber-100 text-amber-700",
  MATCHED: "bg-blue-100 text-blue-700",
  APPROVED: "bg-indigo-100 text-indigo-700",
  FULFILLED: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-red-100 text-red-700",
};

const urgencyStyles = {
  NORMAL: "bg-slate-100 text-slate-600",
  URGENT: "bg-orange-100 text-orange-700",
  CRITICAL: "bg-red-100 text-red-700",
};

const compatibility = {
  O_NEGATIVE: [
    "O_NEGATIVE",
    "O_POSITIVE",
    "A_NEGATIVE",
    "A_POSITIVE",
    "B_NEGATIVE",
    "B_POSITIVE",
    "AB_NEGATIVE",
    "AB_POSITIVE",
  ],

  O_POSITIVE: ["O_POSITIVE", "A_POSITIVE", "B_POSITIVE", "AB_POSITIVE"],

  A_NEGATIVE: ["A_NEGATIVE", "A_POSITIVE", "AB_NEGATIVE", "AB_POSITIVE"],

  A_POSITIVE: ["A_POSITIVE", "AB_POSITIVE"],

  B_NEGATIVE: ["B_NEGATIVE", "B_POSITIVE", "AB_NEGATIVE", "AB_POSITIVE"],

  B_POSITIVE: ["B_POSITIVE", "AB_POSITIVE"],

  AB_NEGATIVE: ["AB_NEGATIVE", "AB_POSITIVE"],

  AB_POSITIVE: ["AB_POSITIVE"],
};

const formatStatus = (status) => {
  if (!status) return "Unknown";

  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const getBloodTypeLabel = (bloodType) => {
  return bloodTypeLabels[bloodType] || bloodType || "—";
};

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getHospitalName = (request) => {
  return (
    request?.hospitalName ||
    request?.hospital?.organizationName ||
    request?.hospital?.firstName ||
    "Unknown Hospital"
  );
};

const getPatientName = (request) => {
  return request?.patientName || "Not provided";
};

const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
      statusStyles[status] || "bg-slate-100 text-slate-600"
    }`}
  >
    {formatStatus(status)}
  </span>
);

const UrgencyBadge = ({ urgency }) => (
  <span
    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
      urgencyStyles[urgency] || "bg-slate-100 text-slate-600"
    }`}
  >
    {formatStatus(urgency)}
  </span>
);

const AdminBloodRequests = () => {
  const [requests, setRequests] = useState([]);
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [loadingDonors, setLoadingDonors] = useState(false);

  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  const [error, setError] = useState("");

  const [reloadKey, setReloadKey] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [urgencyFilter, setUrgencyFilter] = useState("ALL");
  const [bloodTypeFilter, setBloodTypeFilter] = useState("ALL");

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedDonorId, setSelectedDonorId] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const [requestsResponse, donorsResponse] = await Promise.all([
          api.getAllRequests(),
          api.getAllDonors(),
        ]);

        const requestData =
          requestsResponse?.data?.items ||
          requestsResponse?.data?.requests ||
          requestsResponse?.data ||
          [];

        const donorData =
          donorsResponse?.data?.items ||
          donorsResponse?.data?.donors ||
          donorsResponse?.data ||
          [];

        if (isMounted) {
          setRequests(Array.isArray(requestData) ? requestData : []);
          setDonors(Array.isArray(donorData) ? donorData : []);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err?.response?.data?.message ||
              err?.message ||
              "Failed to load blood requests.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [reloadKey]);

  /*
   * Only donors who are currently available and have a compatible
   * blood type are shown for the selected request.
   */
  const compatibleDonors = useMemo(() => {
    if (!selectedRequest?.bloodType) {
      return [];
    }

    return donors.filter((donor) => {
      const donorBloodType =
        donor?.bloodType || donor?.user?.donorProfile?.bloodType;

      const isAvailable =
        donor?.isAvailable ?? donor?.user?.donorProfile?.isAvailable ?? false;

      if (!donorBloodType || !isAvailable) {
        return false;
      }

      return (
        compatibility[donorBloodType]?.includes(selectedRequest.bloodType) ??
        false
      );
    });
  }, [donors, selectedRequest]);

  const filteredRequests = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return requests.filter((request) => {
      const hospitalName = getHospitalName(request).toLowerCase();
      const patientName = getPatientName(request).toLowerCase();

      const matchesSearch =
        !search ||
        hospitalName.includes(search) ||
        patientName.includes(search) ||
        request?.ward?.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "ALL" || request?.status === statusFilter;

      const matchesUrgency =
        urgencyFilter === "ALL" || request?.urgency === urgencyFilter;

      const matchesBloodType =
        bloodTypeFilter === "ALL" || request?.bloodType === bloodTypeFilter;

      return (
        matchesSearch && matchesStatus && matchesUrgency && matchesBloodType
      );
    });
  }, [requests, searchTerm, statusFilter, urgencyFilter, bloodTypeFilter]);

  const stats = useMemo(() => {
    return {
      total: requests.length,

      pending: requests.filter((request) => request?.status === "PENDING")
        .length,

      matched: requests.filter((request) => request?.status === "MATCHED")
        .length,

      fulfilled: requests.filter((request) => request?.status === "FULFILLED")
        .length,

      critical: requests.filter((request) => request?.urgency === "CRITICAL")
        .length,
    };
  }, [requests]);

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("ALL");
    setUrgencyFilter("ALL");
    setBloodTypeFilter("ALL");
  };

  const closeModal = () => {
    if (actionLoading) return;

    setSelectedRequest(null);
    setSelectedDonorId("");
    setActionError("");
    setActionSuccess("");
  };

  const openRequest = (request) => {
    setSelectedRequest(request);
    setSelectedDonorId("");
    setActionError("");
    setActionSuccess("");
  };

  const handleApprove = async () => {
    if (!selectedRequest) return;

    if (!selectedDonorId) {
      setActionError("Please select a compatible donor before approving.");
      return;
    }

    setActionLoading(true);
    setActionError("");
    setActionSuccess("");

    try {
      await api.approveRequest(selectedRequest.id, selectedDonorId);

      setActionSuccess("Blood request approved successfully.");

      /*
       * Refresh the request list so the new APPROVED status
       * and updated inventory state are immediately visible.
       */
      setReloadKey((current) => current + 1);

      /*
       * Close the modal after the action succeeds.
       */
      setSelectedRequest(null);
      setSelectedDonorId("");
    } catch (err) {
      setActionError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to approve the blood request.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;

    const confirmed = window.confirm(
      "Are you sure you want to reject this blood request?",
    );

    if (!confirmed) {
      return;
    }

    setActionLoading(true);
    setActionError("");
    setActionSuccess("");

    try {
      await api.rejectRequest(selectedRequest.id);

      setActionSuccess("Blood request rejected successfully.");

      setReloadKey((current) => current + 1);

      setSelectedRequest(null);
      setSelectedDonorId("");
    } catch (err) {
      setActionError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to reject the blood request.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Blood Requests</h1>

          <p className="mt-1 text-sm text-slate-500">
            Monitor and review blood requests submitted by hospitals.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setReloadKey((current) => current + 1)}
          disabled={loading}
          className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <svg
            className={`mr-2 h-5 w-5 ${loading ? "animate-spin" : ""}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20 11a8.1 8.1 0 0 0-15.5-2M4 5v4h4" />
            <path d="M4 13a8.1 8.1 0 0 0 15.5 2M20 19v-4h-4" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Success */}
      {actionSuccess && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {actionSuccess}
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total Requests</p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {stats.total}
          </p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
          <p className="text-sm font-medium text-amber-700">Pending</p>

          <p className="mt-2 text-2xl font-bold text-amber-800">
            {stats.pending}
          </p>
        </div>

        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
          <p className="text-sm font-medium text-blue-700">Matched</p>

          <p className="mt-2 text-2xl font-bold text-blue-800">
            {stats.matched}
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
          <p className="text-sm font-medium text-emerald-700">Fulfilled</p>

          <p className="mt-2 text-2xl font-bold text-emerald-800">
            {stats.fulfilled}
          </p>
        </div>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 shadow-sm">
          <p className="text-sm font-medium text-red-700">Critical</p>

          <p className="mt-2 text-2xl font-bold text-red-800">
            {stats.critical}
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-red-700">{error}</p>

          <button
            type="button"
            onClick={() => setReloadKey((current) => current + 1)}
            className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {/* Search */}
          <div>
            <label
              htmlFor="request-search"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Search
            </label>

            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>

              <input
                id="request-search"
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Hospital, patient, ward..."
                className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label
              htmlFor="request-status"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Status
            </label>

            <select
              id="request-status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
            >
              <option value="ALL">All statuses</option>
              <option value="PENDING">Pending</option>
              <option value="MATCHED">Matched</option>
              <option value="APPROVED">Approved</option>
              <option value="FULFILLED">Fulfilled</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          {/* Urgency */}
          <div>
            <label
              htmlFor="request-urgency"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Urgency
            </label>

            <select
              id="request-urgency"
              value={urgencyFilter}
              onChange={(event) => setUrgencyFilter(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
            >
              <option value="ALL">All urgency levels</option>
              <option value="NORMAL">Normal</option>
              <option value="URGENT">Urgent</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>

          {/* Blood type */}
          <div>
            <label
              htmlFor="request-blood-type"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Blood Type
            </label>

            <select
              id="request-blood-type"
              value={bloodTypeFilter}
              onChange={(event) => setBloodTypeFilter(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
            >
              <option value="ALL">All blood types</option>

              {Object.entries(bloodTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {(searchTerm ||
          statusFilter !== "ALL" ||
          urgencyFilter !== "ALL" ||
          bloodTypeFilter !== "ALL") && (
          <div className="mt-4 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-medium text-red-600 hover:text-red-700"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Loading */}
      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-red-600" />

          <p className="mt-4 text-sm text-slate-500">
            Loading blood requests...
          </p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
            <svg
              className="h-7 w-7 text-slate-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 12h6" />
              <path d="M12 9v6" />
              <path d="M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" />
            </svg>
          </div>

          <h3 className="mt-4 text-lg font-semibold text-slate-800">
            No blood requests found
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Try changing your search or filters.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-275">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Hospital
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Patient
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Blood Type
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Units
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Urgency
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Date
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Details
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredRequests.map((request) => (
                    <tr
                      key={request.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-900">
                          {getHospitalName(request)}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-slate-800">
                          {getPatientName(request)}
                        </p>

                        {request.patientAge && (
                          <p className="mt-1 text-xs text-slate-500">
                            Age: {request.patientAge}
                          </p>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <span className="font-bold text-slate-800">
                          {getBloodTypeLabel(request.bloodType)}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-700">
                        {request.unitsNeeded || 0}
                      </td>

                      <td className="px-5 py-4">
                        <UrgencyBadge urgency={request.urgency} />
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={request.status} />
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-500">
                        {formatDate(request.createdAt)}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => openRequest(request)}
                          className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile/tablet cards */}
          <div className="grid gap-4 lg:hidden">
            {filteredRequests.map((request) => (
              <div
                key={request.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {getHospitalName(request)}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {getPatientName(request)}
                    </p>
                  </div>

                  <StatusBadge status={request.status} />
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                  <div>
                    <p className="text-xs text-slate-400">Blood Type</p>

                    <p className="mt-1 font-bold text-slate-800">
                      {getBloodTypeLabel(request.bloodType)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Units Needed</p>

                    <p className="mt-1 font-semibold text-slate-800">
                      {request.unitsNeeded || 0}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Urgency</p>

                    <div className="mt-1">
                      <UrgencyBadge urgency={request.urgency} />
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Date</p>

                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {formatDate(request.createdAt)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => openRequest(request)}
                  className="mt-5 w-full rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                >
                  View Request
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Request details modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Blood Request Details
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Submitted {formatDate(selectedRequest.createdAt)}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={actionLoading}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close details"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6 p-6">
              {/* Status */}
              <div className="flex flex-wrap gap-2">
                <StatusBadge status={selectedRequest.status} />

                <UrgencyBadge urgency={selectedRequest.urgency} />
              </div>

              {/* Action error */}
              {actionError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {actionError}
                </div>
              )}

              {/* Hospital */}
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Hospital Information
                </h3>

                <div className="grid gap-4 rounded-xl bg-slate-50 p-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-slate-400">Hospital</p>

                    <p className="mt-1 text-sm font-medium text-slate-800">
                      {getHospitalName(selectedRequest)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Ward</p>

                    <p className="mt-1 text-sm font-medium text-slate-800">
                      {selectedRequest.ward || "—"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Patient */}
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Patient Information
                </h3>

                <div className="grid gap-4 rounded-xl bg-slate-50 p-4 sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-slate-400">Patient Name</p>

                    <p className="mt-1 text-sm font-medium text-slate-800">
                      {getPatientName(selectedRequest)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Age</p>

                    <p className="mt-1 text-sm font-medium text-slate-800">
                      {selectedRequest.patientAge || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Gender</p>

                    <p className="mt-1 text-sm font-medium text-slate-800">
                      {selectedRequest.patientGender || "—"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Request */}
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Request Information
                </h3>

                <div className="grid gap-4 rounded-xl bg-slate-50 p-4 sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-slate-400">Blood Type</p>

                    <p className="mt-1 text-lg font-bold text-slate-800">
                      {getBloodTypeLabel(selectedRequest.bloodType)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Units Needed</p>

                    <p className="mt-1 text-lg font-bold text-slate-800">
                      {selectedRequest.unitsNeeded || 0}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Status</p>

                    <div className="mt-1">
                      <StatusBadge status={selectedRequest.status} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Additional Notes
                </h3>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                    {selectedRequest.notes || "No additional notes."}
                  </p>
                </div>
              </div>

              {/* Request actions */}
              {["PENDING", "MATCHED"].includes(selectedRequest.status) && (
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <h3 className="text-sm font-semibold text-slate-800">
                    Administrative Actions
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Select a compatible available donor before approving this
                    request. Approval will assign the donor and deduct the
                    requested units from inventory.
                  </p>

                  <div className="mt-4">
                    <label
                      htmlFor="donor-selection"
                      className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                      Select Donor
                    </label>

                    {compatibleDonors.length === 0 ? (
                      <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-700">
                        No compatible available donors were found for{" "}
                        {getBloodTypeLabel(selectedRequest.bloodType)}.
                      </div>
                    ) : (
                      <select
                        id="donor-selection"
                        value={selectedDonorId}
                        onChange={(event) =>
                          setSelectedDonorId(event.target.value)
                        }
                        disabled={actionLoading}
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                      >
                        <option value="">Select a compatible donor</option>

                        {compatibleDonors.map((donor) => {
                          const donorUser = donor.user || donor;
                          const donorProfile =
                            donor.user?.donorProfile || donor;

                          const donorName =
                            `${donorUser.firstName || ""} ${
                              donorUser.lastName || ""
                            }`.trim() || "Unnamed donor";

                          const donorBloodType =
                            donorProfile.bloodType || donor.bloodType;

                          return (
                            <option
                              key={donorUser.id || donor.id}
                              value={donorUser.id || donor.id}
                            >
                              {donorName} — {getBloodTypeLabel(donorBloodType)}
                            </option>
                          );
                        })}
                      </select>
                    )}
                  </div>

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={handleApprove}
                      disabled={
                        actionLoading ||
                        compatibleDonors.length === 0 ||
                        !selectedDonorId
                      }
                      className="flex-1 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {actionLoading ? "Processing..." : "Approve Request"}
                    </button>

                    <button
                      type="button"
                      onClick={handleReject}
                      disabled={actionLoading}
                      className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {actionLoading ? "Processing..." : "Reject Request"}
                    </button>
                  </div>
                </div>
              )}

              {/* Already processed */}
              {!["PENDING", "MATCHED"].includes(selectedRequest.status) && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-sm font-medium text-slate-700">
                    No administrative action is available for this request.
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    This request has already been{" "}
                    {formatStatus(selectedRequest.status).toLowerCase()}.
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={closeModal}
                disabled={actionLoading}
                className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBloodRequests;
