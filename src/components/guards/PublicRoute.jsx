import {
  Navigate,
  Outlet
} from "react-router-dom";

import useAuth from "../../hooks/useAuth.js";

const PublicRoute = () => {
  const {
    user,
    loading,
    initialized
  } = useAuth();

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

  if (user) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return <Outlet />;
};

export default PublicRoute;