import {
  apiGet,
  apiPost,
  apiPatch
} from "./client.js";

const getLeadsApi = (params = {}) => {
  const searchParams = new URLSearchParams();

  if (params.status) {
    searchParams.set("status", params.status);
  }

  if (params.search) {
    searchParams.set("search", params.search);
  }

  if (params.clientName) {
    searchParams.set("clientName", params.clientName);
  }

  if (params.page) {
    searchParams.set("page", params.page);
  }

  if (params.limit) {
    searchParams.set("limit", params.limit);
  }

  const query = searchParams.toString();

  return apiGet(
    `/leads${query ? `?${query}` : ""}`
  );
};

const getLeadApi = (leadId) => {
  return apiGet(
    `/leads/${leadId}`
  );
};

const createLeadApi = (data) => {
  return apiPost(
    "/leads",
    data
  );
};

const updateLeadApi = (
  leadId,
  data
) => {
  return apiPatch(
    `/leads/${leadId}`,
    data
  );
};

const updateLeadStatusApi = (
  leadId,
  status
) => {
  return apiPatch(
    `/leads/${leadId}/status`,
    { status }
  );
};

const getLeadEmailsApi = (
  leadId
) => {
  return apiGet(
    `/leads/${leadId}/emails`
  );
};

export {
  getLeadsApi,
  getLeadApi,
  createLeadApi,
  updateLeadApi,
  updateLeadStatusApi,
  getLeadEmailsApi
};