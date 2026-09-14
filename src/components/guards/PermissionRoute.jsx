import {
  Navigate,
  Outlet
} from "react-router-dom";

import useAuth from "../../hooks/useAuth.js";

const PermissionRoute = ({
  permission,
  permissions = [],
  requireAll = false
}) => {
  const {
    user,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions
  } = useAuth();

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (permission) {
    if (
      !hasPermission(permission)
    ) {
      return (
        <Navigate
          to="/dashboard"
          replace
        />
      );
    }
  }

  if (permissions.length) {
    const allowed =
      requireAll
        ? hasAllPermissions(
            permissions
          )
        : hasAnyPermission(
            permissions
          );

    if (!allowed) {
      return (
        <Navigate
          to="/dashboard"
          replace
        />
      );
    }
  }

  return <Outlet />;
};

export default PermissionRoute;