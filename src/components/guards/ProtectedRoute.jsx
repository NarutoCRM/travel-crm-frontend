import {
  Navigate,
  Outlet,
  useLocation
} from "react-router-dom";

import useAuth from "../../hooks/useAuth.js";

const ProtectedRoute = () => {
  const {
    user,
    loading,
    initialized
  } = useAuth();

  const location =
    useLocation();

  if (
    loading ||
    !initialized
  ) {
    return (
      <div className="auth-loading">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location
        }}
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;