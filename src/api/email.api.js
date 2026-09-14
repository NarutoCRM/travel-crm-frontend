import {
  apiGet,
  apiPost
} from "./client.js";

const getEmailsApi = (
  status = ""
) => {
  const query = status
    ? `?status=${encodeURIComponent(
        status
      )}`
    : "";

  return apiGet(
    `/emails${query}`
  );
};

const getEmailApi = (
  emailId
) => {
  return apiGet(
    `/emails/${emailId}`
  );
};

const sendEmailApi = (data) => {
  return apiPost(
    "/emails/send",
    data
  );
};

export {
  getEmailsApi,
  getEmailApi,
  sendEmailApi
};