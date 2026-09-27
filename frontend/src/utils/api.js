const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api/v1";

let accessTokenMemory = null;

// Holds the current refresh operation so multiple expired requests
// can wait for the same refresh instead of refreshing separately.
let refreshPromise = null;

export const setAccessToken = (token) => {
  accessTokenMemory = token;
};

export const getAccessToken = () => {
  return accessTokenMemory;
};

export const clearAccessToken = () => {
  accessTokenMemory = null;
};

const refreshAccessToken = async () => {
  const refreshResponse = await fetch(`${BASE_URL}/auth/refresh-token`, {
    method: "POST",
    credentials: "include",
  });

  const refreshData = await refreshResponse.json().catch(() => ({}));

  if (!refreshResponse.ok) {
    clearAccessToken();

    const error = new Error(refreshData.message || "Session expired");

    error.status = refreshResponse.status;
    error.data = refreshData;

    throw error;
  }

  const newAccessToken = refreshData.data?.accessToken;

  if (!newAccessToken) {
    clearAccessToken();

    const error = new Error("No access token returned");

    error.status = 401;
    error.data = refreshData;

    throw error;
  }

  setAccessToken(newAccessToken);

  return newAccessToken;
};

const request = async (endpoint, options = {}, retry = true) => {
  const token = getAccessToken();

  const config = {
    ...options,

    // Allows the browser to send the HTTP-only refresh-token cookie.
    credentials: "include",

    headers: {
      ...(options.body !== undefined
        ? {
            "Content-Type": "application/json",
          }
        : {}),

      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),

      ...(options.headers || {}),
    },
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  const data = await response.json().catch(() => ({}));

  /*
   * If the access token has expired, obtain a new one using
   * the HTTP-only refresh-token cookie.
   *
   * A shared promise prevents multiple simultaneous requests
   * from attempting to rotate the same refresh token.
   */
  if (response.status === 401 && retry && endpoint !== "/auth/refresh-token") {
    try {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }

      await refreshPromise;

      /*
       * Retry the original request exactly once using
       * the newly issued access token.
       */
      return request(endpoint, options, false);
    } catch (error) {
      clearAccessToken();

      if (error instanceof Error) {
        throw error;
      }

      throw new Error("Unauthorized", {
        cause: error,
      });
    }
  }

  if (!response.ok) {
    const error = new Error(
      data?.message || data?.error || "Something went wrong",
    );

    error.status = response.status;
    error.data = data;

    throw error;
  }

  return data;
};

export const api = {
  // Authentication

  login: (body) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  register: (body) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  refreshToken: () =>
    request("/auth/refresh-token", {
      method: "POST",
    }),

  getCurrentUser: () => request("/auth/me"),

  logout: () =>
    request("/auth/logout", {
      method: "POST",
    }),

  // Donors

  getMyDonorProfile: () => request("/donors/me"),

  updateDonorProfile: (body) =>
    request("/donors/me", {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  updateAvailability: (isAvailable) =>
    request("/donors/me/availability", {
      method: "PATCH",
      body: JSON.stringify({
        isAvailable,
      }),
    }),

  updateBloodType: (bloodType) =>
    request("/donors/me/blood-type", {
      method: "PATCH",
      body: JSON.stringify({
        bloodType,
      }),
    }),

  getAllDonors: (page = 1, limit = 20) =>
    request(`/donors?page=${page}&limit=${limit}`),

  // Blood Requests

  createRequest: (body) =>
    request("/requests", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  getMyRequests: (page = 1, limit = 20) =>
    request(`/requests/mine?page=${page}&limit=${limit}`),

  getAllRequests: (page = 1, limit = 20) =>
    request(`/requests?page=${page}&limit=${limit}`),

  approveRequest: (id, donorId) =>
    request(`/requests/${id}/approve`, {
      method: "PATCH",
      body: JSON.stringify({
        donorId,
      }),
    }),

  rejectRequest: (id) =>
    request(`/requests/${id}/reject`, {
      method: "PATCH",
    }),

  // Inventory

  getInventory: () => request("/inventory"),

  updateInventory: (bloodType, unitsAvailable) =>
    request(`/inventory/${bloodType}`, {
      method: "PATCH",
      body: JSON.stringify({
        unitsAvailable,
      }),
    }),

  // Notifications

  getNotifications: (page = 1, limit = 20) =>
    request(`/notifications?page=${page}&limit=${limit}`),

  markNotificationAsRead: (id) =>
    request(`/notifications/${id}/read`, {
      method: "PATCH",
    }),

  // Admin

  getUsers: (page = 1, limit = 20) =>
    request(`/admin/users?page=${page}&limit=${limit}`),

  getAdminDashboardSummary: () => request("/admin/dashboard-summary"),

  updateUserStatus: (id, isActive) =>
    request(`/admin/users/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({
        isActive,
      }),
    }),

  verifyInstitution: (id, isVerifiedInstitution) =>
    request(`/admin/users/${id}/verify-institution`, {
      method: "PATCH",
      body: JSON.stringify({
        isVerifiedInstitution,
      }),
    }),

  createAdmin: (body) =>
    request("/admin/users/admin", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  changeUserRole: (id, role) =>
    request(`/admin/users/${id}/role`, {
      method: "PATCH",
      body: JSON.stringify({
        role,
      }),
    }),
};
