import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../utils/api.js";

const bloodTypes = [
  { value: "", label: "All blood types" },
  { value: "A_POSITIVE", label: "A+" },
  { value: "A_NEGATIVE", label: "A-" },
  { value: "B_POSITIVE", label: "B+" },
  { value: "B_NEGATIVE", label: "B-" },
  { value: "AB_POSITIVE", label: "AB+" },
  { value: "AB_NEGATIVE", label: "AB-" },
  { value: "O_POSITIVE", label: "O+" },
  { value: "O_NEGATIVE", label: "O-" },
];

const getBloodTypeLabel = (bloodType) => {
  const type = bloodTypes.find((item) => item.value === bloodType);

  return type?.label || bloodType || "Not provided";
};

const getInitials = (firstName, lastName) => {
  const first = firstName?.charAt(0) || "";
  const last = lastName?.charAt(0) || "";

  return `${first}${last}`.toUpperCase() || "D";
};

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getAvailabilityLabel = (isAvailable) => {
  return isAvailable ? "Available" : "Unavailable";
};

const AvailabilityBadge = ({ isAvailable }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
      isAvailable
        ? "bg-emerald-100 text-emerald-700"
        : "bg-gray-100 text-gray-600"
    }`}
  >
    <span
      className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
        isAvailable ? "bg-emerald-500" : "bg-gray-400"
      }`}
    />
    {getAvailabilityLabel(isAvailable)}
  </span>
);

const AccountStatusBadge = ({ isActive }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
      isActive ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"
    }`}
  >
    {isActive ? "Active" : "Inactive"}
  </span>
);

const VerificationBadge = ({ isVerified }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
      isVerified
        ? "bg-emerald-100 text-emerald-700"
        : "bg-amber-100 text-amber-700"
    }`}
  >
    {isVerified ? "Verified" : "Unverified"}
  </span>
);

export default function Donors() {
  const { user: currentUser } = useAuth();

  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [bloodTypeFilter, setBloodTypeFilter] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [actionLoading, setActionLoading] = useState(null);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchDonors = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await api.getAllDonors();

        const donorData =
          response?.data?.donors ||
          response?.data?.items ||
          response?.data ||
          [];

        if (isMounted) {
          setDonors(Array.isArray(donorData) ? donorData : []);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err?.response?.data?.message ||
              err?.message ||
              "Failed to load donors.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDonors();

    return () => {
      isMounted = false;
    };
  }, [reloadKey]);

  const filteredDonors = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return donors.filter((donor) => {
      const firstName = donor?.user?.firstName || donor?.firstName || "";

      const lastName = donor?.user?.lastName || donor?.lastName || "";

      const email = donor?.user?.email || donor?.email || "";

      const phone = donor?.phone || donor?.user?.donorProfile?.phone || "";

      const city = donor?.city || donor?.user?.donorProfile?.city || "";

      const state = donor?.state || donor?.user?.donorProfile?.state || "";

      const bloodType =
        donor?.bloodType || donor?.user?.donorProfile?.bloodType || "";

      const isAvailable =
        donor?.isAvailable ?? donor?.user?.donorProfile?.isAvailable ?? false;

      const isActive = donor?.user?.isActive ?? donor?.isActive ?? true;

      const fullName = `${firstName} ${lastName}`.trim();

      const matchesSearch =
        !search ||
        fullName.toLowerCase().includes(search) ||
        email.toLowerCase().includes(search) ||
        phone.toLowerCase().includes(search) ||
        city.toLowerCase().includes(search) ||
        state.toLowerCase().includes(search);

      const matchesBloodType =
        !bloodTypeFilter || bloodType === bloodTypeFilter;

      const matchesAvailability =
        availabilityFilter === "ALL" ||
        (availabilityFilter === "AVAILABLE" && isAvailable) ||
        (availabilityFilter === "UNAVAILABLE" && !isAvailable);

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && isActive) ||
        (statusFilter === "INACTIVE" && !isActive);

      return (
        matchesSearch &&
        matchesBloodType &&
        matchesAvailability &&
        matchesStatus
      );
    });
  }, [donors, searchTerm, bloodTypeFilter, availabilityFilter, statusFilter]);

  const stats = useMemo(() => {
    const total = donors.length;

    const available = donors.filter((donor) => {
      return (
        donor?.isAvailable ?? donor?.user?.donorProfile?.isAvailable ?? false
      );
    }).length;

    const active = donors.filter((donor) => {
      return donor?.user?.isActive ?? donor?.isActive ?? true;
    }).length;

    const verified = donors.filter((donor) => {
      return donor?.user?.isEmailVerified ?? donor?.isEmailVerified ?? false;
    }).length;

    return {
      total,
      available,
      active,
      verified,
    };
  }, [donors]);

  const handleToggleStatus = async (donor) => {
    const donorUser = donor?.user || donor;

    const userId = donorUser?.id;

    if (!userId) {
      setActionError("Unable to identify this donor.");
      return;
    }

    const currentStatus = donorUser?.isActive ?? true;
    const newStatus = !currentStatus;

    const donorName = `${donorUser?.firstName || ""} ${
      donorUser?.lastName || ""
    }`.trim();

    const actionText = newStatus ? "activate" : "deactivate";

    const confirmed = window.confirm(
      `Are you sure you want to ${actionText} ${
        donorName || "this donor"
      }'s account?`,
    );

    if (!confirmed) return;

    setActionLoading(userId);
    setActionError("");

    try {
      await api.updateUserStatus(userId, newStatus);

      setDonors((currentDonors) =>
        currentDonors.map((item) => {
          const itemUserId = item?.user?.id || item?.id;

          if (itemUserId !== userId) {
            return item;
          }

          if (item?.user) {
            return {
              ...item,
              user: {
                ...item.user,
                isActive: newStatus,
              },
            };
          }

          return {
            ...item,
            isActive: newStatus,
          };
        }),
      );
    } catch (err) {
      setActionError(
        err?.response?.data?.message ||
          err?.message ||
          `Failed to ${actionText} donor account.`,
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleRetry = () => {
    setReloadKey((current) => current + 1);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setBloodTypeFilter("");
    setAvailabilityFilter("ALL");
    setStatusFilter("ALL");
  };

  const getDonorData = (donor) => {
    const donorProfile = donor?.user?.donorProfile;

    return {
      id: donor?.user?.id || donor?.id,
      firstName: donor?.user?.firstName || donor?.firstName || "",
      lastName: donor?.user?.lastName || donor?.lastName || "",
      email: donor?.user?.email || donor?.email || "",
      phone: donor?.phone || donorProfile?.phone || "",
      bloodType: donor?.bloodType || donorProfile?.bloodType || "",
      gender: donor?.gender || donorProfile?.gender || "",
      city: donor?.city || donorProfile?.city || "",
      state: donor?.state || donorProfile?.state || "",
      country: donor?.country || donorProfile?.country || "Nigeria",
      dateOfBirth: donor?.dateOfBirth || donorProfile?.dateOfBirth || null,
      isAvailable: donor?.isAvailable ?? donorProfile?.isAvailable ?? false,
      smsOptIn: donor?.smsOptIn ?? donorProfile?.smsOptIn ?? false,
      isActive: donor?.user?.isActive ?? donor?.isActive ?? true,
      isEmailVerified:
        donor?.user?.isEmailVerified ?? donor?.isEmailVerified ?? false,
      createdAt: donor?.user?.createdAt || donor?.createdAt || null,
    };
  };

  const isAdmin = currentUser?.role === "ADMIN";
  const isSuperAdmin = currentUser?.role === "SUPER_ADMIN";

  if (!isAdmin && !isSuperAdmin) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-lg font-semibold text-red-800">Access denied</h2>
        <p className="mt-1 text-sm text-red-700">
          You do not have permission to access donor management.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Donors</h1>

        <p className="mt-1 text-sm text-gray-500">
          View and manage registered blood donors.
        </p>
      </div>

      {/* Action Error */}
      {actionError && (
        <div className="flex items-start justify-between gap-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-700">{actionError}</p>

          <button
            type="button"
            onClick={() => setActionError("")}
            className="text-sm font-medium text-red-700 hover:text-red-900"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Total Donors</p>

          <p className="mt-2 text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Available Donors</p>

          <p className="mt-2 text-2xl font-bold text-emerald-600">
            {stats.available}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Active Accounts</p>

          <p className="mt-2 text-2xl font-bold text-blue-600">
            {stats.active}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Email Verified</p>

          <p className="mt-2 text-2xl font-bold text-purple-600">
            {stats.verified}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {/* Search */}
          <div className="xl:col-span-2">
            <label
              htmlFor="donor-search"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Search donors
            </label>

            <input
              id="donor-search"
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Name, email, phone or location..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Blood Type */}
          <div>
            <label
              htmlFor="blood-type-filter"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Blood type
            </label>

            <select
              id="blood-type-filter"
              value={bloodTypeFilter}
              onChange={(event) => setBloodTypeFilter(event.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              {bloodTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Availability */}
          <div>
            <label
              htmlFor="availability-filter"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Availability
            </label>

            <select
              id="availability-filter"
              value={availabilityFilter}
              onChange={(event) => setAvailabilityFilter(event.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="ALL">All donors</option>
              <option value="AVAILABLE">Available</option>
              <option value="UNAVAILABLE">Unavailable</option>
            </select>
          </div>

          {/* Account Status */}
          <div>
            <label
              htmlFor="status-filter"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Account status
            </label>

            <select
              id="status-filter"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="ALL">All statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          {/* Clear */}
          <div className="flex items-end">
            <button
              type="button"
              onClick={clearFilters}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Donor Content */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div>
            <h2 className="font-semibold text-gray-900">Registered Donors</h2>

            <p className="mt-0.5 text-sm text-gray-500">
              {filteredDonors.length} donor
              {filteredDonors.length === 1 ? "" : "s"} found
            </p>
          </div>

          <button
            type="button"
            onClick={handleRetry}
            disabled={loading}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Refresh
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center px-5 py-12">
            <div className="text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

              <p className="mt-3 text-sm text-gray-500">Loading donors...</p>
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="px-5 py-12 text-center">
            <p className="text-sm text-red-600">{error}</p>

            <button
              type="button"
              onClick={handleRetry}
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filteredDonors.length === 0 && (
          <div className="px-5 py-12 text-center">
            <p className="font-medium text-gray-900">No donors found</p>

            <p className="mt-1 text-sm text-gray-500">
              Try changing your search or filters.
            </p>
          </div>
        )}

        {/* Desktop Table */}
        {!loading && !error && filteredDonors.length > 0 && (
          <div className="hidden overflow-x-auto md:block">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Donor
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Blood Type
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Contact
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Location
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Availability
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>

                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredDonors.map((donor) => {
                  const data = getDonorData(donor);

                  return (
                    <tr key={data.id} className="transition hover:bg-gray-50">
                      <td className="whitespace-nowrap px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                            {getInitials(data.firstName, data.lastName)}
                          </div>

                          <div>
                            <p className="font-medium text-gray-900">
                              {data.firstName} {data.lastName}
                            </p>

                            <div className="mt-1 flex items-center gap-2">
                              <p className="text-xs text-gray-500">
                                Joined {formatDate(data.createdAt)}
                              </p>

                              <VerificationBadge
                                isVerified={data.isEmailVerified}
                              />
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4">
                        <span className="inline-flex min-w-10 items-center justify-center rounded-lg bg-red-50 px-2.5 py-1.5 text-sm font-bold text-red-700">
                          {getBloodTypeLabel(data.bloodType)}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm text-gray-900">
                          {data.email || "—"}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {data.phone || "No phone number"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm text-gray-900">
                          {data.city || "—"}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {data.state || data.country}
                        </p>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4">
                        <AvailabilityBadge isAvailable={data.isAvailable} />
                      </td>

                      <td className="whitespace-nowrap px-5 py-4">
                        <AccountStatusBadge isActive={data.isActive} />
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(donor)}
                          disabled={actionLoading === data.id}
                          className={`rounded-lg px-3 py-2 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                            data.isActive
                              ? "border border-red-200 text-red-600 hover:bg-red-50"
                              : "border border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                          }`}
                        >
                          {actionLoading === data.id
                            ? "Updating..."
                            : data.isActive
                              ? "Deactivate"
                              : "Activate"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Mobile Cards */}
        {!loading && !error && filteredDonors.length > 0 && (
          <div className="divide-y divide-gray-200 md:hidden">
            {filteredDonors.map((donor) => {
              const data = getDonorData(donor);

              return (
                <div key={data.id} className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                        {getInitials(data.firstName, data.lastName)}
                      </div>

                      <div>
                        <p className="font-semibold text-gray-900">
                          {data.firstName} {data.lastName}
                        </p>

                        <p className="mt-0.5 text-xs text-gray-500">
                          {data.email || "No email"}
                        </p>
                      </div>
                    </div>

                    <span className="inline-flex min-w-10 items-center justify-center rounded-lg bg-red-50 px-2.5 py-1.5 text-sm font-bold text-red-700">
                      {getBloodTypeLabel(data.bloodType)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-gray-50 p-3">
                      <p className="text-xs text-gray-500">Phone</p>

                      <p className="mt-1 text-sm font-medium text-gray-900">
                        {data.phone || "—"}
                      </p>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-3">
                      <p className="text-xs text-gray-500">Gender</p>

                      <p className="mt-1 text-sm font-medium text-gray-900">
                        {data.gender || "—"}
                      </p>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-3">
                      <p className="text-xs text-gray-500">Location</p>

                      <p className="mt-1 text-sm font-medium text-gray-900">
                        {data.city || "—"}
                      </p>

                      <p className="text-xs text-gray-500">
                        {data.state || data.country}
                      </p>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-3">
                      <p className="text-xs text-gray-500">Joined</p>

                      <p className="mt-1 text-sm font-medium text-gray-900">
                        {formatDate(data.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <AvailabilityBadge isAvailable={data.isAvailable} />

                    <AccountStatusBadge isActive={data.isActive} />

                    <VerificationBadge isVerified={data.isEmailVerified} />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleStatus(donor)}
                    disabled={actionLoading === data.id}
                    className={`w-full rounded-lg px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                      data.isActive
                        ? "border border-red-200 text-red-600 hover:bg-red-50"
                        : "border border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                    }`}
                  >
                    {actionLoading === data.id
                      ? "Updating..."
                      : data.isActive
                        ? "Deactivate Donor"
                        : "Activate Donor"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
