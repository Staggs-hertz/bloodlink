import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../utils/api.js";

const getInitials = (firstName, lastName) => {
  const first = firstName?.charAt(0) || "";
  const last = lastName?.charAt(0) || "";

  return `${first}${last}`.toUpperCase() || "A";
};

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const StatusBadge = ({ isActive }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
      isActive
        ? "bg-emerald-100 text-emerald-700"
        : "bg-slate-100 text-slate-600"
    }`}
  >
    <span
      className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
        isActive ? "bg-emerald-500" : "bg-slate-400"
      }`}
    />
    {isActive ? "Active" : "Inactive"}
  </span>
);

const VerificationBadge = ({ isVerified }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
      isVerified ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
    }`}
  >
    {isVerified ? "Verified" : "Unverified"}
  </span>
);

const ManageAdmins = () => {
  const { user: currentUser } = useAuth();

  const isSuperAdmin = currentUser?.role === "SUPER_ADMIN";

  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [actionLoading, setActionLoading] = useState(null);
  const [actionError, setActionError] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creatingAdmin, setCreatingAdmin] = useState(false);
  const [createError, setCreateError] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (!isSuperAdmin) {
      return;
    }

    let isMounted = true;

    const fetchAdmins = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await api.getUsers();

        const userData =
          response?.data?.users ||
          response?.data?.items ||
          response?.data ||
          [];

        const adminUsers = Array.isArray(userData)
          ? userData.filter(
              (item) => (item?.role || item?.user?.role) === "ADMIN",
            )
          : [];

        if (isMounted) {
          setAdmins(adminUsers);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err?.response?.data?.message ||
              err?.message ||
              "Failed to load administrators.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAdmins();

    return () => {
      isMounted = false;
    };
  }, [reloadKey, isSuperAdmin]);

  const getAdminData = (admin) => {
    const user = admin?.user || admin;

    return {
      id: user?.id,
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      role: user?.role || "",
      isActive: Boolean(user?.isActive),
      isEmailVerified: Boolean(user?.isEmailVerified),
      createdAt: user?.createdAt,
    };
  };

  const filteredAdmins = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return admins.filter((admin) => {
      const data = getAdminData(admin);

      const fullName = `${data.firstName} ${data.lastName}`.toLowerCase();

      const matchesSearch =
        !normalizedSearch ||
        fullName.includes(normalizedSearch) ||
        data.email.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && data.isActive) ||
        (statusFilter === "INACTIVE" && !data.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [admins, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    const total = admins.length;

    const active = admins.filter(
      (admin) => getAdminData(admin).isActive,
    ).length;

    const inactive = total - active;

    const verified = admins.filter(
      (admin) => getAdminData(admin).isEmailVerified,
    ).length;

    return {
      total,
      active,
      inactive,
      verified,
    };
  }, [admins]);

  const handleToggleStatus = async (admin) => {
    const data = getAdminData(admin);

    if (!data.id) {
      return;
    }

    if (data.id === currentUser?.id) {
      setActionError("You cannot deactivate your own account.");
      return;
    }

    const newStatus = !data.isActive;

    const confirmed = window.confirm(
      `Are you sure you want to ${
        newStatus ? "activate" : "deactivate"
      } ${data.firstName} ${data.lastName}'s account?`,
    );

    if (!confirmed) {
      return;
    }

    setActionLoading(data.id);
    setActionError("");

    try {
      await api.updateUserStatus(data.id, newStatus);

      setAdmins((currentAdmins) =>
        currentAdmins.map((item) => {
          const itemData = getAdminData(item);

          if (itemData.id !== data.id) {
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
          "Failed to update administrator status.",
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const resetCreateForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    });

    setCreateError("");
  };

  const handleCloseCreateModal = () => {
    if (creatingAdmin) {
      return;
    }

    setShowCreateModal(false);
    resetCreateForm();
  };

  const handleCreateAdmin = async (event) => {
    event.preventDefault();

    const firstName = formData.firstName.trim();
    const lastName = formData.lastName.trim();
    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    if (!firstName || !lastName || !email || !password) {
      setCreateError("Please fill in all fields.");
      return;
    }

    if (password.length < 8) {
      setCreateError("Password must be at least 8 characters long.");
      return;
    }

    setCreatingAdmin(true);
    setCreateError("");

    try {
      await api.createAdmin({
        firstName,
        lastName,
        email,
        password,
      });

      setShowCreateModal(false);
      resetCreateForm();

      setReloadKey((current) => current + 1);
    } catch (err) {
      setCreateError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to create administrator.",
      );
    } finally {
      setCreatingAdmin(false);
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-lg font-semibold text-red-800">Access Denied</h2>

        <p className="mt-2 text-sm text-red-700">
          Only Super Administrators can manage administrator accounts.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Manage Administrators
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Create and manage BloodLink administrator accounts.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            resetCreateForm();
            setShowCreateModal(true);
          }}
          className="inline-flex items-center justify-center rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          <svg
            className="mr-2 h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          Create Admin
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total Admins</p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {stats.total}
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
          <p className="text-sm font-medium text-emerald-700">Active</p>

          <p className="mt-2 text-2xl font-bold text-emerald-800">
            {stats.active}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-600">Inactive</p>

          <p className="mt-2 text-2xl font-bold text-slate-800">
            {stats.inactive}
          </p>
        </div>

        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
          <p className="text-sm font-medium text-blue-700">Email Verified</p>

          <p className="mt-2 text-2xl font-bold text-blue-800">
            {stats.verified}
          </p>
        </div>
      </div>

      {/* Error messages */}
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

      {actionError && (
        <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4">
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

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-[1fr_200px]">
          <div>
            <label
              htmlFor="admin-search"
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
                id="admin-search"
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by name or email..."
                className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="status-filter"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Status
            </label>

            <select
              id="status-filter"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
            >
              <option value="ALL">All statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-red-600" />

          <p className="mt-4 text-sm text-slate-500">
            Loading administrators...
          </p>
        </div>
      ) : filteredAdmins.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
            <svg
              className="h-7 w-7 text-slate-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>

          <h3 className="mt-4 text-lg font-semibold text-slate-800">
            No administrators found
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {searchTerm || statusFilter !== "ALL"
              ? "Try changing your search or filter."
              : "There are currently no administrator accounts."}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-225">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Administrator
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Email
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Verification
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Created
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredAdmins.map((admin) => {
                    const data = getAdminData(admin);
                    const isCurrentUser = data.id === currentUser?.id;
                    const isActionLoading = actionLoading === data.id;

                    return (
                      <tr
                        key={data.id}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-700">
                              {getInitials(data.firstName, data.lastName)}
                            </div>

                            <div>
                              <p className="font-medium text-slate-900">
                                {data.firstName} {data.lastName}
                              </p>

                              {isCurrentUser && (
                                <span className="text-xs text-red-600">
                                  You
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {data.email}
                        </td>

                        <td className="px-5 py-4">
                          <VerificationBadge
                            isVerified={data.isEmailVerified}
                          />
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge isActive={data.isActive} />
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-500">
                          {formatDate(data.createdAt)}
                        </td>

                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            disabled={isCurrentUser || isActionLoading}
                            onClick={() => handleToggleStatus(admin)}
                            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                              isCurrentUser
                                ? "cursor-not-allowed bg-slate-100 text-slate-400"
                                : data.isActive
                                  ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                                  : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            }`}
                          >
                            {isActionLoading
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
          </div>

          {/* Mobile/tablet cards */}
          <div className="grid gap-4 lg:hidden">
            {filteredAdmins.map((admin) => {
              const data = getAdminData(admin);
              const isCurrentUser = data.id === currentUser?.id;
              const isActionLoading = actionLoading === data.id;

              return (
                <div
                  key={data.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100 font-bold text-red-700">
                        {getInitials(data.firstName, data.lastName)}
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate font-semibold text-slate-900">
                          {data.firstName} {data.lastName}
                        </h3>

                        <p className="truncate text-sm text-slate-500">
                          {data.email}
                        </p>

                        {isCurrentUser && (
                          <span className="text-xs font-medium text-red-600">
                            Your account
                          </span>
                        )}
                      </div>
                    </div>

                    <StatusBadge isActive={data.isActive} />
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                    <div>
                      <p className="text-xs text-slate-400">Verification</p>

                      <div className="mt-1">
                        <VerificationBadge isVerified={data.isEmailVerified} />
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">Created</p>

                      <p className="mt-1 text-sm font-medium text-slate-700">
                        {formatDate(data.createdAt)}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={isCurrentUser || isActionLoading}
                    onClick={() => handleToggleStatus(admin)}
                    className={`mt-5 w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                      isCurrentUser
                        ? "cursor-not-allowed bg-slate-100 text-slate-400"
                        : data.isActive
                          ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                          : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    }`}
                  >
                    {isActionLoading
                      ? "Updating..."
                      : data.isActive
                        ? "Deactivate Administrator"
                        : "Activate Administrator"}
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Create Admin Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Create Administrator
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Create a new BloodLink admin account.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseCreateModal}
                disabled={creatingAdmin}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed"
                aria-label="Close modal"
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

            <form onSubmit={handleCreateAdmin} className="space-y-5 p-6">
              {createError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3">
                  <p className="text-sm text-red-700">{createError}</p>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="firstName"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    First Name
                  </label>

                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleFormChange}
                    disabled={creatingAdmin}
                    placeholder="First name"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100 disabled:bg-slate-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Last Name
                  </label>

                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleFormChange}
                    disabled={creatingAdmin}
                    placeholder="Last name"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100 disabled:bg-slate-100"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  disabled={creatingAdmin}
                  placeholder="admin@example.com"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100 disabled:bg-slate-100"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Temporary Password
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleFormChange}
                  disabled={creatingAdmin}
                  placeholder="Minimum 8 characters"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100 disabled:bg-slate-100"
                />

                <p className="mt-1.5 text-xs text-slate-400">
                  The administrator can change their password later.
                </p>
              </div>

              <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">
                <p className="text-sm text-blue-700">
                  This account will automatically be created with the{" "}
                  <strong>ADMIN</strong> role. You do not need to select a role
                  here.
                </p>
              </div>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleCloseCreateModal}
                  disabled={creatingAdmin}
                  className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={creatingAdmin}
                  className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {creatingAdmin ? "Creating..." : "Create Administrator"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAdmins;
