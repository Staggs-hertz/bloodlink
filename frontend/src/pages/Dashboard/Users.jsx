import { useAuth } from "../../context/AuthContext.jsx";
import { useEffect, useMemo, useState } from "react";
import { api } from "../../utils/api.js";

const roleLabels = {
  DONOR: "Donor",
  HOSPITAL: "Hospital",
  ADMIN: "Admin",
  SUPER_ADMIN: "Super Admin",
};

const roleStyles = {
  DONOR: "bg-blue-100 text-blue-700",
  HOSPITAL: "bg-purple-100 text-purple-700",
  ADMIN: "bg-orange-100 text-orange-700",
  SUPER_ADMIN: "bg-red-100 text-red-700",
};

const getInitials = (firstName, lastName) => {
  const first = firstName?.charAt(0) || "";
  const last = lastName?.charAt(0) || "";

  return `${first}${last}`.toUpperCase() || "U";
};

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

function RoleBadge({ role }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
        roleStyles[role] || "bg-secondary text-muted-foreground"
      }`}
    >
      {roleLabels[role] || role || "Unknown"}
    </span>
  );
}

function StatusBadge({ isActive }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
        isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

function VerificationBadge({ user }) {
  if (user.role !== "HOSPITAL") {
    return (
      <span className="text-xs text-muted-foreground">Not applicable</span>
    );
  }

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
        user.isVerifiedInstitution
          ? "bg-green-100 text-green-700"
          : "bg-yellow-100 text-yellow-700"
      }`}
    >
      {user.isVerifiedInstitution ? "Verified" : "Unverified"}
    </span>
  );
}

export default function Users() {
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [actionLoading, setActionLoading] = useState(null);
  const [actionError, setActionError] = useState("");

  const [roleModalUser, setRoleModalUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");

  const isSuperAdmin = currentUser?.role === "SUPER_ADMIN";

  useEffect(() => {
    let isMounted = true;

    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.getUsers();

        const userData =
          response?.data?.users ||
          response?.data?.items ||
          response?.data ||
          [];

        if (isMounted) {
          setUsers(Array.isArray(userData) ? userData : []);
        }
      } catch (err) {
        console.error("Failed to load users:", err);

        if (isMounted) {
          setError(err?.message || "Unable to load users. Please try again.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUsers();

    return () => {
      isMounted = false;
    };
  }, [reloadKey]);

  const handleRetry = () => {
    setReloadKey((currentKey) => currentKey + 1);
  };

  const filteredUsers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return users.filter((user) => {
      const fullName = `${user.firstName || ""} ${user.lastName || ""}`
        .trim()
        .toLowerCase();

      const email = user.email?.toLowerCase() || "";
      const organization = user.organizationName?.toLowerCase() || "";

      const matchesSearch =
        !normalizedSearch ||
        fullName.includes(normalizedSearch) ||
        email.includes(normalizedSearch) ||
        organization.includes(normalizedSearch);

      const matchesRole = roleFilter === "ALL" || user.role === roleFilter;

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && user.isActive) ||
        (statusFilter === "INACTIVE" && !user.isActive);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  const handleToggleStatus = async (targetUser) => {
    if (targetUser.id === currentUser?.id) {
      setActionError("You cannot deactivate your own account.");
      return;
    }

    if (targetUser.role === "SUPER_ADMIN" && !isSuperAdmin) {
      setActionError("You do not have permission to modify a Super Admin.");
      return;
    }

    const action = targetUser.isActive ? "deactivate" : "activate";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${
        targetUser.firstName || "this"
      } ${targetUser.lastName || "user"}'s account?`,
    );

    if (!confirmed) return;

    try {
      setActionLoading(`status-${targetUser.id}`);
      setActionError("");

      await api.updateUserStatus(targetUser.id, !targetUser.isActive);

      setUsers((previousUsers) =>
        previousUsers.map((user) =>
          user.id === targetUser.id
            ? {
                ...user,
                isActive: !user.isActive,
              }
            : user,
        ),
      );
    } catch (err) {
      console.error("Failed to update user status:", err);

      setActionError(
        err?.message || "Unable to update the user's account status.",
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleVerifyInstitution = async (targetUser) => {
    if (targetUser.role !== "HOSPITAL") {
      return;
    }

    if (targetUser.isVerifiedInstitution) {
      return;
    }

    try {
      setActionLoading(`verify-${targetUser.id}`);
      setActionError("");

      await api.verifyInstitution(targetUser.id);

      setUsers((previousUsers) =>
        previousUsers.map((user) =>
          user.id === targetUser.id
            ? {
                ...user,
                isVerifiedInstitution: true,
              }
            : user,
        ),
      );
    } catch (err) {
      console.error("Failed to verify institution:", err);

      setActionError(err?.message || "Unable to verify this institution.");
    } finally {
      setActionLoading(null);
    }
  };

  const openRoleModal = (targetUser) => {
    if (!isSuperAdmin) {
      setActionError("Only a Super Admin can change user roles.");
      return;
    }

    if (targetUser.id === currentUser?.id) {
      setActionError("You cannot change your own role.");
      return;
    }

    setActionError("");
    setRoleModalUser(targetUser);
    setSelectedRole(targetUser.role);
  };

  const closeRoleModal = () => {
    if (actionLoading) return;

    setRoleModalUser(null);
    setSelectedRole("");
  };

  const handleChangeRole = async () => {
    if (!roleModalUser || !selectedRole) {
      return;
    }

    if (selectedRole === roleModalUser.role) {
      closeRoleModal();
      return;
    }

    const confirmed = window.confirm(
      `Change ${roleModalUser.firstName || "this"} ${
        roleModalUser.lastName || "user"
      }'s role to ${roleLabels[selectedRole] || selectedRole}?`,
    );

    if (!confirmed) return;

    try {
      setActionLoading(`role-${roleModalUser.id}`);
      setActionError("");

      await api.changeUserRole(roleModalUser.id, selectedRole);

      setUsers((previousUsers) =>
        previousUsers.map((user) =>
          user.id === roleModalUser.id
            ? {
                ...user,
                role: selectedRole,
                isVerifiedInstitution:
                  selectedRole === "HOSPITAL"
                    ? user.isVerifiedInstitution
                    : false,
              }
            : user,
        ),
      );

      closeRoleModal();
    } catch (err) {
      console.error("Failed to change user role:", err);

      setActionError(err?.message || "Unable to change the user's role.");
    } finally {
      setActionLoading(null);
    }
  };

  const totalUsers = users.length;

  const donorCount = users.filter((user) => user.role === "DONOR").length;

  const hospitalCount = users.filter((user) => user.role === "HOSPITAL").length;

  const activeCount = users.filter((user) => user.isActive).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          User Management
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          View and manage registered BloodLink users and institutions.
        </p>
      </div>

      {/* Error */}
      {(error || actionError) && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span>{error || actionError}</span>

            {error && (
              <button
                type="button"
                onClick={handleRetry}
                className="font-medium underline hover:no-underline"
              >
                Try again
              </button>
            )}

            {actionError && !error && (
              <button
                type="button"
                onClick={() => setActionError("")}
                className="font-medium underline hover:no-underline"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      )}

      {/* Summary */}
      {!loading && !error && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-xl bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">Total Users</p>

            <p className="mt-2 text-2xl font-semibold text-foreground">
              {totalUsers}
            </p>
          </div>

          <div className="rounded-xl bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">Donors</p>

            <p className="mt-2 text-2xl font-semibold text-blue-600">
              {donorCount}
            </p>
          </div>

          <div className="rounded-xl bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">Hospitals</p>

            <p className="mt-2 text-2xl font-semibold text-purple-600">
              {hospitalCount}
            </p>
          </div>

          <div className="rounded-xl bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">Active Accounts</p>

            <p className="mt-2 text-2xl font-semibold text-green-600">
              {activeCount}
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-3">
          {/* Search */}
          <div className="md:col-span-1">
            <label
              htmlFor="user-search"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Search
            </label>

            <input
              id="user-search"
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Name, email or organization..."
              className="w-full rounded-lg shadow-lg bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Role */}
          <div>
            <label
              htmlFor="role-filter"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Role
            </label>

            <select
              id="role-filter"
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
              className="w-full rounded-lg shadow-lg bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="ALL">All Roles</option>
              <option value="DONOR">Donors</option>
              <option value="HOSPITAL">Hospitals</option>
              <option value="ADMIN">Admins</option>
              <option value="SUPER_ADMIN">Super Admins</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label
              htmlFor="status-filter"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Account Status
            </label>

            <select
              id="status-filter"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="w-full rounded-lg shadow-lg bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="ALL">All Accounts</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>

        {!loading && (
          <div className="mt-4 text-xs text-muted-foreground">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        )}
      </div>

      {/* User List */}
      <div className="overflow-hidden rounded-xl bg-card shadow-lg">
        <div className="border-b border-border px-6 py-5">
          <h2 className="text-lg font-semibold text-foreground">
            Registered Users
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage user accounts, institution verification, and permissions.
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/40">
                  {[
                    "User",
                    "Role",
                    "Status",
                    "Verification",
                    "Joined",
                    "Actions",
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
                {[1, 2, 3, 4, 5].map((item) => (
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
        ) : filteredUsers.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-2xl">
              👥
            </div>

            <h3 className="mt-4 text-lg font-semibold text-foreground">
              No users found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              No users match the current search or filter criteria.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/40">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      User
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Role
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Verification
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Joined
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((targetUser) => {
                    const isCurrentUser = targetUser.id === currentUser?.id;

                    const canModify =
                      !isCurrentUser &&
                      (targetUser.role !== "SUPER_ADMIN" || isSuperAdmin);

                    const canVerify =
                      targetUser.role === "HOSPITAL" &&
                      !targetUser.isVerifiedInstitution;

                    return (
                      <tr
                        key={targetUser.id}
                        className="border-b border-border last:border-0 hover:bg-secondary/20"
                      >
                        {/* User */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                              {getInitials(
                                targetUser.firstName,
                                targetUser.lastName,
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-foreground">
                                {targetUser.firstName} {targetUser.lastName}
                                {isCurrentUser && (
                                  <span className="ml-2 text-xs text-muted-foreground">
                                    (You)
                                  </span>
                                )}
                              </p>

                              <p className="truncate text-xs text-muted-foreground">
                                {targetUser.email}
                              </p>

                              {targetUser.organizationName && (
                                <p className="mt-1 truncate text-xs text-muted-foreground">
                                  {targetUser.organizationName}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="px-6 py-5">
                          <RoleBadge role={targetUser.role} />
                        </td>

                        {/* Status */}
                        <td className="px-6 py-5">
                          <StatusBadge isActive={targetUser.isActive} />
                        </td>

                        {/* Verification */}
                        <td className="px-6 py-5">
                          <VerificationBadge user={targetUser} />
                        </td>

                        {/* Joined */}
                        <td className="px-6 py-5 text-sm text-muted-foreground">
                          {formatDate(targetUser.createdAt)}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-5">
                          <div className="flex flex-wrap gap-2">
                            {canVerify && (
                              <button
                                type="button"
                                disabled={
                                  actionLoading === `verify-${targetUser.id}`
                                }
                                onClick={() =>
                                  handleVerifyInstitution(targetUser)
                                }
                                className="rounded-lg bg-purple-100 px-3 py-2 text-xs font-medium text-purple-700 transition-colors hover:bg-purple-200 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {actionLoading === `verify-${targetUser.id}`
                                  ? "Verifying..."
                                  : "Verify"}
                              </button>
                            )}

                            {canModify && (
                              <button
                                type="button"
                                disabled={
                                  actionLoading === `status-${targetUser.id}`
                                }
                                onClick={() => handleToggleStatus(targetUser)}
                                className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                                  targetUser.isActive
                                    ? "bg-red-100 text-red-700 hover:bg-red-200"
                                    : "bg-green-100 text-green-700 hover:bg-green-200"
                                }`}
                              >
                                {actionLoading === `status-${targetUser.id}`
                                  ? "Updating..."
                                  : targetUser.isActive
                                    ? "Deactivate"
                                    : "Activate"}
                              </button>
                            )}

                            {isSuperAdmin && !isCurrentUser && (
                              <button
                                type="button"
                                onClick={() => openRoleModal(targetUser)}
                                className="rounded-lg shadow-lg bg-card px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
                              >
                                Change Role
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="space-y-4 p-4 md:hidden">
              {filteredUsers.map((targetUser) => {
                const isCurrentUser = targetUser.id === currentUser?.id;

                const canModify =
                  !isCurrentUser &&
                  (targetUser.role !== "SUPER_ADMIN" || isSuperAdmin);

                const canVerify =
                  targetUser.role === "HOSPITAL" &&
                  !targetUser.isVerifiedInstitution;

                return (
                  <div
                    key={targetUser.id}
                    className="rounded-xl border border-border p-4"
                  >
                    {/* User Header */}
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {getInitials(targetUser.firstName, targetUser.lastName)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-foreground">
                            {targetUser.firstName} {targetUser.lastName}
                          </p>

                          {isCurrentUser && (
                            <span className="text-xs text-muted-foreground">
                              (You)
                            </span>
                          )}
                        </div>

                        <p className="mt-1 break-all text-xs text-muted-foreground">
                          {targetUser.email}
                        </p>

                        {targetUser.organizationName && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {targetUser.organizationName}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* User Details */}
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Role</p>

                        <div className="mt-1">
                          <RoleBadge role={targetUser.role} />
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">Status</p>

                        <div className="mt-1">
                          <StatusBadge isActive={targetUser.isActive} />
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">
                          Verification
                        </p>

                        <div className="mt-1">
                          <VerificationBadge user={targetUser} />
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">Joined</p>

                        <p className="mt-1 text-sm text-foreground">
                          {formatDate(targetUser.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    {(canVerify ||
                      canModify ||
                      (isSuperAdmin && !isCurrentUser)) && (
                      <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
                        {canVerify && (
                          <button
                            type="button"
                            disabled={
                              actionLoading === `verify-${targetUser.id}`
                            }
                            onClick={() => handleVerifyInstitution(targetUser)}
                            className="rounded-lg bg-purple-100 px-3 py-2 text-xs font-medium text-purple-700 transition-colors hover:bg-purple-200 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {actionLoading === `verify-${targetUser.id}`
                              ? "Verifying..."
                              : "Verify Institution"}
                          </button>
                        )}

                        {canModify && (
                          <button
                            type="button"
                            disabled={
                              actionLoading === `status-${targetUser.id}`
                            }
                            onClick={() => handleToggleStatus(targetUser)}
                            className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                              targetUser.isActive
                                ? "bg-red-100 text-red-700 hover:bg-red-200"
                                : "bg-green-100 text-green-700 hover:bg-green-200"
                            }`}
                          >
                            {actionLoading === `status-${targetUser.id}`
                              ? "Updating..."
                              : targetUser.isActive
                                ? "Deactivate"
                                : "Activate"}
                          </button>
                        )}

                        {isSuperAdmin && !isCurrentUser && (
                          <button
                            type="button"
                            onClick={() => openRoleModal(targetUser)}
                            className="rounded-lg shadow-lg bg-card px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
                          >
                            Change Role
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Change Role Modal */}
      {roleModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-card p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Change User Role
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Change the role assigned to{" "}
                  <span className="font-medium text-foreground">
                    {roleModalUser.firstName} {roleModalUser.lastName}
                  </span>
                  .
                </p>
              </div>

              <button
                type="button"
                onClick={closeRoleModal}
                disabled={Boolean(actionLoading)}
                className="text-xl leading-none text-muted-foreground hover:text-foreground disabled:cursor-not-allowed"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="mt-6">
              <label
                htmlFor="change-role"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                User Role
              </label>

              <select
                id="change-role"
                value={selectedRole}
                onChange={(event) => setSelectedRole(event.target.value)}
                disabled={Boolean(actionLoading)}
                className="w-full rounded-lg shadow-lg bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="DONOR">Donor</option>
                <option value="HOSPITAL">Hospital</option>
                <option value="ADMIN">Admin</option>
                <option value="SUPER_ADMIN">Super Admin</option>
              </select>

              {selectedRole === "HOSPITAL" && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Hospital accounts may require institution verification before
                  they can perform certain hospital operations.
                </p>
              )}
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeRoleModal}
                disabled={Boolean(actionLoading)}
                className="rounded-lgshadow-lg bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleChangeRole}
                disabled={
                  Boolean(actionLoading) || selectedRole === roleModalUser.role
                }
                className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {actionLoading === `role-${roleModalUser.id}`
                  ? "Updating..."
                  : "Change Role"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
