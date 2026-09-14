import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";

import {
  loginApi,
  getMeApi
} from "../api/auth.api.js";

import {
  saveAuth,
  clearAuth,
  getToken,
  getStoredUser
} from "../utils/auth.js";

export const AuthContext =
  createContext(null);

export const AuthProvider = ({
  children
}) => {
  const [
    user,
    setUser
  ] = useState(
    getStoredUser()
  );

  const [
    loading,
    setLoading
  ] = useState(true);

  const [
    initialized,
    setInitialized
  ] = useState(false);

  const login = useCallback(
    async (
      email,
      password
    ) => {
      const response =
        await loginApi(
          email,
          password
        );

      const token =
        response?.data?.token;

      const loggedInUser =
        response?.data?.user;

      if (
        !token ||
        !loggedInUser
      ) {
        throw new Error(
          "Invalid login response"
        );
      }

      saveAuth(
        token,
        loggedInUser
      );

      setUser(
        loggedInUser
      );

      return loggedInUser;
    },
    []
  );

  const logout =
    useCallback(() => {
      clearAuth();
      setUser(null);
    }, []);

  const refreshUser =
    useCallback(
      async () => {
        if (!getToken()) {
          setUser(null);
          return null;
        }

        const response =
          await getMeApi();

        const currentUser =
          response?.data;

        if (!currentUser) {
          throw new Error(
            "Invalid user response"
          );
        }

        sessionStorage.setItem(
          "travel_crm_user",
          JSON.stringify(
            currentUser
          )
        );

        setUser(
          currentUser
        );

        return currentUser;
      },
      []
    );

  useEffect(() => {
    const initializeAuth =
      async () => {
        try {
          if (getToken()) {
            await refreshUser();
          }
        } catch {
          clearAuth();
          setUser(null);
        } finally {
          setLoading(false);
          setInitialized(true);
        }
      };

    initializeAuth();
  }, [refreshUser]);

  const hasRole =
    useCallback(
      (role) => {
        return (
          user?.role === role
        );
      },
      [user]
    );

  const hasPermission =
    useCallback(
      (permission) => {
        return Boolean(
          user?.permissions?.includes(
            permission
          )
        );
      },
      [user]
    );

  const hasAnyPermission =
    useCallback(
      (permissions) => {
        return permissions.some(
          (permission) =>
            user?.permissions?.includes(
              permission
            )
        );
      },
      [user]
    );

  const hasAllPermissions =
    useCallback(
      (permissions) => {
        return permissions.every(
          (permission) =>
            user?.permissions?.includes(
              permission
            )
        );
      },
      [user]
    );

  const value = useMemo(
    () => ({
      user,
      loading,
      initialized,
      isAuthenticated:
        Boolean(user),

      login,
      logout,
      refreshUser,

      hasRole,
      hasPermission,
      hasAnyPermission,
      hasAllPermissions
    }),
    [
      user,
      loading,
      initialized,
      login,
      logout,
      refreshUser,
      hasRole,
      hasPermission,
      hasAnyPermission,
      hasAllPermissions
    ]
  );

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
};