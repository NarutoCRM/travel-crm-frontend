import { useEffect, useState } from "react";

import {
  getEmployeesApi,
  createEmployeeApi,
  updateEmployeeApi
} from "../../api/employee.api.js";

import { getRolesApi } from "../../api/role.api.js";

import useAuth from "../../hooks/useAuth.js";

const INITIAL_FORM = {
  name: "",
  email: "",
  password: "",
  roleId: "",
  status: "ACTIVE"
};

const Employees = () => {
  const { hasPermission } = useAuth();

  const [employees, setEmployees] = useState([]);
  const [roles, setRoles] = useState([]);

  const [form, setForm] = useState(INITIAL_FORM);

  const [editingEmployee, setEditingEmployee] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const canCreate = hasPermission(
    "EMPLOYEE_CREATE"
  );

  const canUpdate = hasPermission(
    "EMPLOYEE_UPDATE"
  );

  // =========================
  // LOAD EMPLOYEES
  // =========================

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getEmployeesApi();

      console.log(
        "Employees API response:",
        response
      );

      setEmployees(
        Array.isArray(response?.data)
          ? response.data
          : []
      );
    } catch (err) {
      console.error(
        "Employees load error:",
        err
      );

      setError(
        err?.message ||
        "Failed to load employees"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOAD ROLES
  // =========================

  const loadRoles = async () => {
    try {
      const response =
        await getRolesApi();

      console.log(
        "Roles API response:",
        response
      );

      setRoles(
        Array.isArray(response?.data)
          ? response.data
          : []
      );
    } catch (err) {
      console.error(
        "Roles load error:",
        err
      );

      setError(
        err?.message ||
        "Failed to load roles"
      );
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        loadEmployees(),
        loadRoles()
      ]);
    };

    loadData();
  }, []);

  // =========================
  // FORM CHANGE
  // =========================

  const handleChange = (event) => {
    const {
      name,
      value
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  // =========================
  // RESET FORM
  // =========================

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setEditingEmployee(null);
    setError("");
  };

  // =========================
  // CREATE / UPDATE
  // =========================

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      // -------------------------
      // UPDATE
      // -------------------------

      if (editingEmployee) {
        const updateData = {
          name: form.name.trim(),
          roleId: form.roleId,
          status: form.status
        };

        // Password only if entered
        if (form.password.trim()) {
          updateData.password =
            form.password.trim();
        }

        console.log(
          "Updating employee:",
          updateData
        );

        await updateEmployeeApi(
          editingEmployee.id,
          updateData
        );

        setSuccess(
          "Employee updated successfully."
        );
      }

      // -------------------------
      // CREATE
      // -------------------------

      else {
        const createData = {
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          roleId: form.roleId,
          status: form.status
        };

        console.log(
          "Creating employee:",
          {
            ...createData,
            password: "***"
          }
        );

        await createEmployeeApi(
          createData
        );

        setSuccess(
          "Employee created successfully."
        );
      }

      resetForm();

      await loadEmployees();
    } catch (err) {
      console.error(
        "Employee save error:",
        err
      );

      setError(
        err?.message ||
        "Failed to save employee"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // EDIT EMPLOYEE
  // =========================

  const handleEdit = (employee) => {
    setEditingEmployee(employee);

    setForm({
      name: employee.name || "",
      email: employee.email || "",
      password: "",
      roleId:
        employee.roleId ||
        employee.role?.id ||
        "",
      status:
        employee.status ||
        "ACTIVE"
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <div className="space-y-6">

      {/* ========================= */}
      {/* PAGE HEADER */}
      {/* ========================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Employees
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage employees, roles and account
            status.
          </p>
        </div>

      </div>

      {/* ========================= */}
      {/* ERROR */}
      {/* ========================= */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* ========================= */}
      {/* SUCCESS */}
      {/* ========================= */}

      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {success}
        </div>
      )}

      {/* ========================= */}
      {/* EMPLOYEE FORM */}
      {/* ========================= */}

      {(canCreate || editingEmployee) && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 px-6 py-5">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {editingEmployee
                    ? "Edit Employee"
                    : "Create Employee"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {editingEmployee
                    ? "Update employee account details."
                    : "Create a new employee account."}
                </p>
              </div>

              {editingEmployee && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
                >
                  Cancel
                </button>
              )}

            </div>

          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2"
          >

            {/* NAME */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter employee name"
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10"
              />
            </div>

            {/* EMAIL */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="employee@example.com"
                required
                disabled={Boolean(
                  editingEmployee
                )}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
              />
            </div>

            {/* PASSWORD */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder={
                  editingEmployee
                    ? "Leave blank to keep current password"
                    : "Minimum 8 characters"
                }
                minLength={8}
                required={!editingEmployee}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10"
              />

              {editingEmployee && (
                <p className="mt-1.5 text-xs text-slate-500">
                  Enter a new password only if
                  you want to change it.
                </p>
              )}
            </div>

            {/* ROLE */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Role
              </label>

              <select
                name="roleId"
                value={form.roleId}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10"
              >
                <option value="">
                  Select role
                </option>

                {roles.map((role) => (
                  <option
                    key={role.id}
                    value={role.id}
                  >
                    {role.name ||
                      role.code ||
                      "Role"}
                  </option>
                ))}
              </select>

              {!roles.length && (
                <p className="mt-1.5 text-xs text-amber-600">
                  No roles available.
                </p>
              )}
            </div>

            {/* STATUS */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Status
              </label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10"
              >
                <option value="ACTIVE">
                  Active
                </option>

                <option value="INACTIVE">
                  Inactive
                </option>

                <option value="INVITED">
                  Invited
                </option>
              </select>
            </div>

            {/* BUTTON */}

            <div className="flex items-end">

              <button
                type="submit"
                disabled={
                  saving ||
                  !form.roleId
                }
                className="w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingEmployee
                    ? "Update Employee"
                    : "Create Employee"}
              </button>

            </div>

          </form>
        </div>
      )}

      {/* ========================= */}
      {/* EMPLOYEE LIST */}
      {/* ========================= */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Employee List
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {employees.length} employee
              {employees.length !== 1
                ? "s"
                : ""}{" "}
              found
            </p>
          </div>

          <button
            type="button"
            onClick={loadEmployees}
            disabled={loading}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            Refresh
          </button>

        </div>

        {/* LOADING */}

        {loading ? (
          <div className="flex min-h-48 items-center justify-center px-6 py-12">

            <div className="text-center">

              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

              <p className="mt-3 text-sm text-slate-500">
                Loading employees...
              </p>

            </div>

          </div>
        ) : employees.length === 0 ? (

          /* EMPTY */

          <div className="px-6 py-16 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
              👤
            </div>

            <h3 className="mt-4 text-base font-semibold text-slate-900">
              No employees found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Create your first employee
              account using the form above.
            </p>

          </div>

        ) : (

          /* TABLE */

          <div className="overflow-x-auto">

            <table className="min-w-full">

              <thead className="bg-slate-50">

                <tr>

                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Employee
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Role
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Last Login
                  </th>

                  {canUpdate && (
                    <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                      Action
                    </th>
                  )}

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {employees.map(
                  (employee) => (
                    <tr
                      key={employee.id}
                      className="transition hover:bg-slate-50"
                    >

                      {/* EMPLOYEE */}

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                            {(
                              employee.name ||
                              "U"
                            )
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div className="min-w-0">

                            <p className="truncate font-semibold text-slate-900">
                              {employee.name ||
                                "-"}
                            </p>

                            <p className="truncate text-sm text-slate-500">
                              {employee.email ||
                                "-"}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* ROLE */}

                      <td className="px-6 py-4">

                        <span className="inline-flex rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
                          {employee.role?.name ||
                            employee.role?.code ||
                            "-"}
                        </span>

                      </td>

                      {/* STATUS */}

                      <td className="px-6 py-4">

                        <span
                          className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${employee.status ===
                              "ACTIVE"
                              ? "bg-emerald-100 text-emerald-700"
                              : employee.status ===
                                "INACTIVE"
                                ? "bg-red-100 text-red-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                        >
                          {employee.status ||
                            "-"}
                        </span>

                      </td>

                      {/* LAST LOGIN */}

                      <td className="px-6 py-4 text-sm text-slate-500">

                        {employee.lastLoginAt
                          ? new Date(
                            employee.lastLoginAt
                          ).toLocaleString()
                          : "Never"}

                      </td>

                      {/* ACTION */}

                      {canUpdate && (
                        <td className="px-6 py-4 text-right">

                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(
                                employee
                              )
                            }
                            className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                          >
                            Edit
                          </button>

                        </td>
                      )}

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>
    </div>
  );
};

export default Employees;