const TOKEN_KEY =
  "travel_crm_token";

const USER_KEY =
  "travel_crm_user";

const getToken = () => {
  return sessionStorage.getItem(
    TOKEN_KEY
  );
};

const getStoredUser = () => {
  const user =
    sessionStorage.getItem(
      USER_KEY
    );

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch {
    sessionStorage.removeItem(
      USER_KEY
    );

    return null;
  }
};

const saveAuth = (
  token,
  user
) => {
  sessionStorage.setItem(
    TOKEN_KEY,
    token
  );

  sessionStorage.setItem(
    USER_KEY,
    JSON.stringify(user)
  );
};

const clearAuth = () => {
  sessionStorage.removeItem(
    TOKEN_KEY
  );

  sessionStorage.removeItem(
    USER_KEY
  );
};

const isAuthenticated = () => {
  return Boolean(
    getToken()
  );
};

export {
  getToken,
  getStoredUser,
  saveAuth,
  clearAuth,
  isAuthenticated
};