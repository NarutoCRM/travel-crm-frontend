const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("VITE_API_BASE_URL is not configured");
}

const getToken = () => {
  return sessionStorage.getItem("travel_crm_token");
};

export const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();

  const headers = {
    ...(options.body
      ? { "Content-Type": "application/json" }
      : {}),
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers
    }
  );

  let result = null;

  try {
    result = await response.json();
  } catch {
    result = null;
  }

  if (response.status === 401) {
    sessionStorage.removeItem("travel_crm_token");
    sessionStorage.removeItem("travel_crm_user");

    window.location.href = "/login";

    throw new Error(
      "Session expired. Please login again."
    );
  }

  if (!response.ok) {
    throw new Error(
      result?.message || "Something went wrong"
    );
  }

  return result;
};

export const apiGet = (endpoint) => {
  return apiRequest(endpoint, {
    method: "GET"
  });
};

export const apiPost = (endpoint, data) => {
  return apiRequest(endpoint, {
    method: "POST",
    body: JSON.stringify(data)
  });
};

export const apiPatch = (endpoint, data) => {
  return apiRequest(endpoint, {
    method: "PATCH",
    body: JSON.stringify(data)
  });
};

export const apiDelete = (endpoint) => {
  return apiRequest(endpoint, {
    method: "DELETE"
  });
};