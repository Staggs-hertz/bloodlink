import { useEffect, useState } from "react";

import { AuthContext } from "./AuthContext";

import { api, setAccessToken, clearAccessToken } from "../utils/api";

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  /*
   * Keep the access token in React state so authentication
   * changes trigger component re-renders.
   *
   * The token is also kept in api.js memory so API requests
   * can attach it to the Authorization header.
   */
  const [accessToken, setAccessTokenState] = useState(null);

  /*
   * Used while checking whether an existing session
   * can be restored.
   */
  const [loading, setLoading] = useState(true);

  /*
   * Restore the user's session when the application loads.
   *
   * The refresh token is stored in an HTTP-only cookie.
   * api.js uses credentials: "include", so the browser
   * automatically sends the cookie to the backend.
   */
  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        /*
         * Ask the backend to rotate the refresh token
         * and issue a new access token.
         */
        const refreshResponse = await api.refreshToken();

        const token = refreshResponse.data?.accessToken;

        if (!token) {
          return;
        }

        /*
         * Store the access token in api.js memory so
         * subsequent API requests can use it.
         */
        setAccessToken(token);

        /*
         * Store the token in React state so components
         * using useAuth() re-render.
         */
        setAccessTokenState(token);

        /*
         * Now retrieve the complete authenticated user
         * from the backend.
         */
        const userResponse = await api.getCurrentUser();

        setUser(userResponse.data);
      } catch {
        /*
         * Session restoration failed.
         * Treat the user as unauthenticated.
         */
        clearAccessToken();
        setAccessTokenState(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrapAuth();
  }, []);

  /*
   * Called after a successful login.
   *
   * The backend has already placed the refresh token
   * in the HTTP-only cookie.
   */
  const login = (userData, token) => {
    setAccessToken(token);
    setAccessTokenState(token);
    setUser(userData);
  };

  /*
   * Log the user out.
   *
   * The backend revokes the refresh token and clears
   * the HTTP-only cookie.
   *
   * The frontend then clears its in-memory access token
   * and user state.
   */
  const logout = async () => {
    try {
      await api.logout();
    } catch {
      /*
       * Even if the backend logout request fails,
       * clear the local authentication state.
       */
    } finally {
      clearAccessToken();
      setAccessTokenState(null);
      setUser(null);
    }
  };

  /*
   * Update only the user information that changed.
   */
  const updateUser = (newUserData) => {
    setUser((currentUser) => {
      if (!currentUser) {
        return null;
      }

      return {
        ...currentUser,
        ...newUserData,
      };
    });
  };

  const value = {
    user,
    accessToken,
    loading,

    /*
     * The user is considered authenticated only when
     * both the user object and access token exist.
     */
    isAuthenticated: Boolean(user && accessToken),

    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
