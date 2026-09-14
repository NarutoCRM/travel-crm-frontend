import { useEffect, useState } from "react";
// import { apiGet, apiPost, apiPatch, apiDelete } from "../../api/role.api";
import {
    getRolesApi,
    createRoleApi,
    updateRoleApi,
    deleteRoleApi,
    getPermissionsApi
} from "../../api/role.api.js";

const permissionGroups = {
    Dashboard: ["DASHBOARD_READ"],

    Leads: [
        "LEAD_CREATE",
        "LEAD_READ",
        "LEAD_UPDATE",
        "LEAD_DELETE",
    ],

    Emails: [
        "EMAIL_CREATE",
        "EMAIL_READ",
        "EMAIL_SEND",
    ],

    Employees: [
        "EMPLOYEE_CREATE",
        "EMPLOYEE_READ",
        "EMPLOYEE_UPDATE",
        "EMPLOYEE_DELETE",
    ],

    "Roles & Access": [
        "ROLE_CREATE",
        "ROLE_READ",
        "ROLE_UPDATE",
        "ROLE_DELETE",
    ],
};

const Roles = () => {
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [editingRole, setEditingRole] = useState(null);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [selectedPermissions, setSelectedPermissions] = useState([]);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");


    const loadData = async () => {
        try {
            setLoading(true);

            const [rolesResponse, permissionsResponse] =
                await Promise.all([
                    getRolesApi(),
                    getPermissionsApi()
                ]);

            setRoles(rolesResponse?.data || []);
            setPermissions(permissionsResponse?.data || []);
        } catch (err) {
            setError(err.message || "Failed to load roles.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const resetForm = () => {
        setName("");
        setDescription("");
        setIsActive(true);
        setSelectedPermissions([]);
        setEditingRole(null);
        setError("");
    };

    const openCreate = () => {
        resetForm();
        setShowModal(true);
    };

    const openEdit = (role) => {
        setEditingRole(role);

        setName(role.name || "");
        setDescription(role.description || "");
        setIsActive(role.isActive);

        setSelectedPermissions(
            role.permissions?.map(
                (item) => item.permissionId
            ) || []
        );

        setError("");
        setShowModal(true);
    };

    const togglePermission = (permissionId) => {
        setSelectedPermissions((current) => {
            if (current.includes(permissionId)) {
                return current.filter(
                    (id) => id !== permissionId
                );
            }

            return [...current, permissionId];
        });
    };

    const getPermission = (code) => {
        return permissions.find(
            (permission) =>
                permission.code === code
        );
    };

    const toggleGroup = (codes) => {
        const ids = codes
            .map((code) => getPermission(code)?.id)
            .filter(Boolean);

        const allSelected = ids.every((id) =>
            selectedPermissions.includes(id)
        );

        if (allSelected) {
            setSelectedPermissions((current) =>
                current.filter(
                    (id) => !ids.includes(id)
                )
            );
        } else {
            setSelectedPermissions((current) =>
                Array.from(
                    new Set([...current, ...ids])
                )
            );
        }
    };

    const saveRole = async (event) => {
        event.preventDefault();

        setError("");
        setMessage("");

        if (!name.trim()) {
            setError("Role name is required.");
            return;
        }

        try {
            setSaving(true);

            const payload = {
                name: name.trim(),
                description: description.trim() || null,
                isActive,
                permissionIds: selectedPermissions,
            };

            if (editingRole) {
                await updateRoleApi(editingRole.id, payload);

                setMessage(
                    "Role updated successfully."
                );
            } else {
                await createRoleApi(payload);

                setMessage(
                    "Role created successfully."
                );
            }

            setShowModal(false);
            resetForm();

            await loadData();
        } catch (err) {
            setError(
                err.message ||
                "Failed to save role."
            );
        } finally {
            setSaving(false);
        }
    };

    const removeRole = async (role) => {
        if (
            !window.confirm(
                `Delete role "${role.name}"?`
            )
        ) {
            return;
        }

        try {
            setError("");

            await deleteRoleApi(role.id);

            setMessage(
                "Role deleted successfully."
            );

            await loadData();
        } catch (err) {
            setError(
                err.message ||
                "Failed to delete role."
            );
        }
    };

    if (loading) {
        return (
            <div className="rounded-2xl bg-white p-8 shadow-sm">
                Loading roles...
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        Roles & Access
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Create roles and control their permissions.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={openCreate}
                    className="rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                >
                    + Create Role
                </button>
            </div>

            {/* Messages */}
            {message && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {message}
                </div>
            )}

            {error && !showModal && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* Roles */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px]">

                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50">

                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Role
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Permissions
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Employees
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Status
                                </th>

                                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Actions
                                </th>

                            </tr>
                        </thead>

                        <tbody>
                            {roles.map((role) => (
                                <tr
                                    key={role.id}
                                    className="border-b border-slate-100 last:border-0"
                                >

                                    <td className="px-6 py-4">
                                        <p className="font-semibold text-slate-900">
                                            {role.name}
                                        </p>

                                        {role.description && (
                                            <p className="mt-1 text-xs text-slate-500">
                                                {role.description}
                                            </p>
                                        )}
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                            {role.permissions?.length || 0}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        {role._count?.users || 0}
                                    </td>

                                    <td className="px-6 py-4">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${role.isActive
                                                ? "bg-emerald-50 text-emerald-700"
                                                : "bg-slate-100 text-slate-500"
                                                }`}
                                        >
                                            {role.isActive
                                                ? "Active"
                                                : "Inactive"}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 text-right">

                                        <div className="flex justify-end gap-2">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    openEdit(role)
                                                }
                                                className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                            >
                                                Edit
                                            </button>

                                            {role.name !==
                                                "SUPER_ADMIN" && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeRole(role)
                                                        }
                                                        className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                                                    >
                                                        Delete
                                                    </button>
                                                )}

                                        </div>

                                    </td>

                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4">

                    <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

                        <div className="border-b border-slate-200 px-6 py-5">

                            <div className="flex items-center justify-between">

                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">
                                        {editingRole
                                            ? "Edit Role"
                                            : "Create Role"}
                                    </h2>

                                    <p className="mt-1 text-xs text-slate-500">
                                        Select the permissions this role should have.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowModal(false)
                                    }
                                    className="text-xl text-slate-400 hover:text-slate-700"
                                >
                                    ×
                                </button>

                            </div>

                        </div>

                        <form
                            onSubmit={saveRole}
                            className="space-y-6 p-6"
                        >

                            {/* Basic Details */}
                            <div className="grid gap-4 sm:grid-cols-2">

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Role Name
                                    </label>

                                    <input
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        placeholder="e.g. Sales Manager"
                                        className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-slate-500"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Description
                                    </label>

                                    <input
                                        value={description}
                                        onChange={(e) =>
                                            setDescription(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Role description"
                                        className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-slate-500"
                                    />
                                </div>

                            </div>

                            {/* Active */}
                            <label className="flex cursor-pointer items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={isActive}
                                    onChange={(e) =>
                                        setIsActive(
                                            e.target.checked
                                        )
                                    }
                                    className="h-4 w-4 rounded"
                                />

                                <span className="text-sm font-medium text-slate-700">
                                    Role is active
                                </span>
                            </label>

                            {/* Permissions */}
                            <div>

                                <div className="mb-4 flex items-center justify-between">

                                    <h3 className="text-sm font-bold text-slate-900">
                                        Permissions
                                    </h3>

                                    <span className="text-xs text-slate-500">
                                        {selectedPermissions.length} selected
                                    </span>

                                </div>

                                <div className="space-y-4">

                                    {Object.entries(
                                        permissionGroups
                                    ).map(
                                        ([groupName, codes]) => {

                                            const groupPermissions =
                                                codes
                                                    .map(
                                                        (code) =>
                                                            getPermission(code)
                                                    )
                                                    .filter(Boolean);

                                            if (
                                                groupPermissions.length ===
                                                0
                                            ) {
                                                return null;
                                            }

                                            const groupIds =
                                                groupPermissions.map(
                                                    (permission) =>
                                                        permission.id
                                                );

                                            const allSelected =
                                                groupIds.every(
                                                    (id) =>
                                                        selectedPermissions.includes(
                                                            id
                                                        )
                                                );

                                            return (
                                                <div
                                                    key={groupName}
                                                    className="rounded-xl border border-slate-200"
                                                >

                                                    <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">

                                                        <p className="text-sm font-semibold text-slate-800">
                                                            {groupName}
                                                        </p>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                toggleGroup(codes)
                                                            }
                                                            className="text-xs font-semibold text-slate-600 hover:text-slate-950"
                                                        >
                                                            {allSelected
                                                                ? "Clear all"
                                                                : "Select all"}
                                                        </button>

                                                    </div>

                                                    <div className="grid gap-2 p-4 sm:grid-cols-2">

                                                        {groupPermissions.map(
                                                            (permission) => (
                                                                <label
                                                                    key={
                                                                        permission.id
                                                                    }
                                                                    className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-50"
                                                                >

                                                                    <input
                                                                        type="checkbox"
                                                                        checked={selectedPermissions.includes(
                                                                            permission.id
                                                                        )}
                                                                        onChange={() =>
                                                                            togglePermission(
                                                                                permission.id
                                                                            )
                                                                        }
                                                                        className="h-4 w-4 rounded"
                                                                    />

                                                                    <span className="text-sm text-slate-700">
                                                                        {permission.code}
                                                                    </span>

                                                                </label>
                                                            )
                                                        )}

                                                    </div>

                                                </div>
                                            );
                                        }
                                    )}

                                </div>

                            </div>

                            {error && (
                                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    {error}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowModal(false)
                                    }
                                    className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingRole
                                            ? "Update Role"
                                            : "Create Role"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

        </div>
    );
};

export default Roles;