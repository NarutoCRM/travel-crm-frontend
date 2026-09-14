import {
  apiPost,
  apiGet
} from "./client.js";

const loginApi = async (
  email,
  password
) => {
  return apiPost(
    "/auth/login",
    {
      email,
      password
    }
  );
};

const getMeApi = async () => {
  return apiGet("/auth/me");
};

export {
  loginApi,
  getMeApi
};