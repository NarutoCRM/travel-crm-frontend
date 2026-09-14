import useAuth from "./useAuth.js";

const usePermission = () => {
  const {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions
  } = useAuth();

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions
  };
};

export default usePermission;