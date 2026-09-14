import {
  apiGet,
  apiPost,
  apiPatch,
  apiDelete
} from "./client.js";

const getRolesApi = () => {
  return apiGet("/roles");
};

const getRoleApi = (id) => {
  return apiGet(`/roles/${id}`);
};

const createRoleApi = (data) => {
  return apiPost("/roles", data);
};

const updateRoleApi = (id, data) => {
  return apiPatch(`/roles/${id}`, data);
};

const deleteRoleApi = (id) => {
  return apiDelete(`/roles/${id}`);
};

const getPermissionsApi = () => {
  return apiGet("/permissions");
};

const getPermissionApi = (id) => {
  return apiGet(`/permissions/${id}`);
};

export {
  getRolesApi,
  getRoleApi,
  createRoleApi,
  updateRoleApi,
  deleteRoleApi,
  getPermissionsApi,
  getPermissionApi
};