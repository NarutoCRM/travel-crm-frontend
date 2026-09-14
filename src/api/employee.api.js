import {
  apiGet,
  apiPost,
  apiPatch
} from "./client.js";

const getEmployeesApi = () => {
  return apiGet("/employees");
};

const createEmployeeApi = (data) => {
  return apiPost("/employees", data);
};

const updateEmployeeApi = (employeeId, data) => {
  return apiPatch(
    `/employees/${employeeId}`,
    data
  );
};

export {
  getEmployeesApi,
  createEmployeeApi,
  updateEmployeeApi
};