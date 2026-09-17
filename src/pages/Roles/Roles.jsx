import { useEffect, useMemo, useState } from "react";

import {
    getRolesApi,
    createRoleApi,
    updateRoleApi,
    deleteRoleApi,
    getPermissionsApi
} from "../../api/role.api.js";

/*
|--------------------------------------------------------------------------
| Permission Group Helper
|--------------------------------------------------------------------------
|
| Permissions database/API se dynamically aayengi.
|
| Example:
|
| LEAD_CLIENT_NAME_READ
| LEAD_EMAIL_READ
| LEAD_PHONE_READ
|
| sab automatically "Leads" group me jayengi.
|
| EMAIL_RECIPIENT_READ
| EMAIL_SUBJECT_READ
|
| sab automatically "Email" group me jayengi.
|
| Agar future me koi completely new prefix aaye:
|
| REPORT_READ
|
| to automatically "Report" group create ho jayega.
|
|--------------------------------------------------------------------------
*/

const getPermissionGroup = (code = "") => {
    const permissionCode = String(code).toUpperCase().trim();

    if (!permissionCode) {
        return "Other";
    }

    /*
    |--------------------------------------------------------------------------
    | Dashboard
    |--------------------------------------------------------------------------
    */

    if (permissionCode.startsWith("DASHBOARD_")) {
        return "Dashboard";
    }

    /*
    |--------------------------------------------------------------------------
    | Leads
    |--------------------------------------------------------------------------
    */

    if (permissionCode.startsWith("LEAD_")) {
        return "Leads";
    }

    /*
    |--------------------------------------------------------------------------
    | Customer Acceptance
    |--------------------------------------------------------------------------
    */

    if (permissionCode.startsWith("ACCEPTANCE_")) {
        return "Customer Acceptance";
    }

    /*
    |--------------------------------------------------------------------------
    | Email
    |--------------------------------------------------------------------------
    */

    if (permissionCode.startsWith("EMAIL_")) {
        return "Email";
    }

    /*
    |--------------------------------------------------------------------------
    | Payment
    |--------------------------------------------------------------------------
    */

    if (
        permissionCode.startsWith("CARD_") ||
        permissionCode.startsWith("PAYMENT_")
    ) {
        return "Payment Information";
    }

    /*
    |--------------------------------------------------------------------------
    | Employees
    |--------------------------------------------------------------------------
    */

    if (permissionCode.startsWith("EMPLOYEE_")) {
        return "Employees";
    }

    /*
    |--------------------------------------------------------------------------
    | Roles & Access
    |--------------------------------------------------------------------------
    */

    if (
        permissionCode.startsWith("ROLE_") ||
        permissionCode.startsWith("PERMISSION_")
    ) {
        return "Roles & Access";
    }

    /*
    |--------------------------------------------------------------------------
    | Automatic Future Group
    |--------------------------------------------------------------------------
    |
    | Example:
    | REPORT_READ
    | REPORT_CREATE
    |
    | => Report
    |
    */

    const prefix = permissionCode.split("_")[0];

    if (prefix) {
        return (
            prefix.charAt(0) +
            prefix.slice(1).toLowerCase()
        );
    }

    return "Other";
};


/*
|--------------------------------------------------------------------------
| Group Order
|--------------------------------------------------------------------------
|
| Existing groups preferred order me rahenge.
| New groups automatically last me aayenge.
|
|--------------------------------------------------------------------------
*/

const GROUP_ORDER = [
    "Dashboard",
    "Leads",
    "Customer Acceptance",
    "Email",
    "Payment Information",
    "Employees",
    "Roles & Access"
];


const Roles = () => {

    /*
    |--------------------------------------------------------------------------
    | State
    |--------------------------------------------------------------------------
    */

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


    /*
    |--------------------------------------------------------------------------
    | Load Roles + Permissions
    |--------------------------------------------------------------------------
    */

    const loadData = async () => {

        try {

            setLoading(true);
            setError("");

            const [
                rolesResponse,
                permissionsResponse
            ] = await Promise.all([
                getRolesApi(),
                getPermissionsApi()
            ]);

            /*
            |--------------------------------------------------------------------------
            | Roles
            |--------------------------------------------------------------------------
            */

            setRoles(
                Array.isArray(rolesResponse?.data)
                    ? rolesResponse.data
                    : []
            );

            /*
            |--------------------------------------------------------------------------
            | Permissions
            |--------------------------------------------------------------------------
            |
            | API se jo bhi permissions aayengi,
            | wahi UI me render hongi.
            |
            */

            setPermissions(
                Array.isArray(permissionsResponse?.data)
                    ? permissionsResponse.data
                    : []
            );

        } catch (err) {

            console.error(
                "Failed to load roles/permissions:",
                err
            );

            setError(
                err?.message ||
                "Failed to load roles."
            );

        } finally {

            setLoading(false);
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Initial Load
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        loadData();

    }, []);


    /*
    |--------------------------------------------------------------------------
    | Reset Form
    |--------------------------------------------------------------------------
    */

    const resetForm = () => {

        setName("");
        setDescription("");
        setIsActive(true);

        setSelectedPermissions([]);

        setEditingRole(null);

        setError("");
    };


    /*
    |--------------------------------------------------------------------------
    | Close Modal
    |--------------------------------------------------------------------------
    */

    const closeModal = () => {

        if (saving) {
            return;
        }

        setShowModal(false);

        resetForm();
    };


    /*
    |--------------------------------------------------------------------------
    | Create Role
    |--------------------------------------------------------------------------
    */

    const openCreate = () => {

        resetForm();

        setShowModal(true);
    };


    /*
    |--------------------------------------------------------------------------
    | Edit Role
    |--------------------------------------------------------------------------
    */

    const openEdit = (role) => {

        setEditingRole(role);

        setName(
            role?.name || ""
        );

        setDescription(
            role?.description || ""
        );

        setIsActive(
            role?.isActive ?? true
        );

        /*
        |--------------------------------------------------------------------------
        | Existing role permissions
        |--------------------------------------------------------------------------
        */

        const rolePermissionIds =
            Array.isArray(role?.permissions)
                ? role.permissions
                    .map((item) => {

                        /*
                        | Backend normally returns:
                        | {
                        |   permissionId: "..."
                        | }
                        */

                        return (
                            item?.permissionId ||
                            item?.permission?.id ||
                            item?.id
                        );

                    })
                    .filter(Boolean)
                : [];

        setSelectedPermissions(
            rolePermissionIds
        );

        setError("");

        setShowModal(true);
    };


    /*
    |--------------------------------------------------------------------------
    | Toggle Single Permission
    |--------------------------------------------------------------------------
    */

    const togglePermission = (
        permissionId
    ) => {

        setSelectedPermissions(
            (current) => {

                if (
                    current.includes(
                        permissionId
                    )
                ) {

                    return current.filter(
                        (id) =>
                            id !== permissionId
                    );
                }

                return [
                    ...current,
                    permissionId
                ];
            }
        );
    };


    /*
    |--------------------------------------------------------------------------
    | Toggle Permission Group
    |--------------------------------------------------------------------------
    */

    const toggleGroup = (
        groupPermissions
    ) => {

        const ids =
            groupPermissions
                .map(
                    (permission) =>
                        permission?.id
                )
                .filter(Boolean);

        if (ids.length === 0) {
            return;
        }

        const allSelected =
            ids.every(
                (id) =>
                    selectedPermissions.includes(
                        id
                    )
            );

        if (allSelected) {

            setSelectedPermissions(
                (current) =>
                    current.filter(
                        (id) =>
                            !ids.includes(id)
                    )
            );

        } else {

            setSelectedPermissions(
                (current) =>
                    Array.from(
                        new Set([
                            ...current,
                            ...ids
                        ])
                    )
            );
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Group Permissions Dynamically
    |--------------------------------------------------------------------------
    |
    | IMPORTANT:
    |
    | No permission list is written here.
    |
    | Database/API -> permissions
    | permissions -> groups
    | groups -> UI
    |
    |--------------------------------------------------------------------------
    */

    const groupedPermissions = useMemo(() => {

        return permissions.reduce(
            (groups, permission) => {

                if (!permission) {
                    return groups;
                }

                const groupName =
                    getPermissionGroup(
                        permission.code
                    );

                if (!groups[groupName]) {
                    groups[groupName] = [];
                }

                groups[groupName].push(
                    permission
                );

                return groups;

            },
            {}
        );

    }, [permissions]);


    /*
    |--------------------------------------------------------------------------
    | Sort Permissions Inside Group
    |--------------------------------------------------------------------------
    */

    const sortPermissions = (
        permissionList
    ) => {

        return [...permissionList].sort(
            (a, b) => {

                const codeA =
                    String(
                        a?.code || ""
                    );

                const codeB =
                    String(
                        b?.code || ""
                    );

                return codeA.localeCompare(
                    codeB
                );
            }
        );
    };


    /*
    |--------------------------------------------------------------------------
    | Sorted Groups
    |--------------------------------------------------------------------------
    |
    | Known groups first.
    | Future unknown groups automatically last.
    |
    |--------------------------------------------------------------------------
    */

    const sortedGroups = useMemo(() => {

        return Object.entries(
            groupedPermissions
        )
            .map(
                ([groupName, groupPermissions]) => {

                    return [
                        groupName,
                        sortPermissions(
                            groupPermissions
                        )
                    ];
                }
            )
            .sort(
                ([groupA], [groupB]) => {

                    const indexA =
                        GROUP_ORDER.indexOf(
                            groupA
                        );

                    const indexB =
                        GROUP_ORDER.indexOf(
                            groupB
                        );

                    const safeA =
                        indexA === -1
                            ? 999
                            : indexA;

                    const safeB =
                        indexB === -1
                            ? 999
                            : indexB;

                    /*
                    |--------------------------------------------------------------------------
                    | Both unknown groups
                    |--------------------------------------------------------------------------
                    */

                    if (
                        safeA === 999 &&
                        safeB === 999
                    ) {

                        return groupA.localeCompare(
                            groupB
                        );
                    }

                    return safeA - safeB;
                }
            );

    }, [groupedPermissions]);


    /*
    |--------------------------------------------------------------------------
    | Total Permission Count
    |--------------------------------------------------------------------------
    */

    const totalPermissions =
        permissions.length;


    /*
    |--------------------------------------------------------------------------
    | Save Role
    |--------------------------------------------------------------------------
    */

    const saveRole = async (
        event
    ) => {

        event.preventDefault();

        setError("");
        setMessage("");

        /*
        |--------------------------------------------------------------------------
        | Validation
        |--------------------------------------------------------------------------
        */

        if (!name.trim()) {

            setError(
                "Role name is required."
            );

            return;
        }


        try {

            setSaving(true);


            /*
            |--------------------------------------------------------------------------
            | Payload
            |--------------------------------------------------------------------------
            */

            const payload = {

                name:
                    name.trim(),

                description:
                    description.trim() ||
                    null,

                isActive,

                permissionIds:
                    selectedPermissions
            };


            /*
            |--------------------------------------------------------------------------
            | Update Existing Role
            |--------------------------------------------------------------------------
            */

            if (editingRole) {

                await updateRoleApi(
                    editingRole.id,
                    payload
                );

                setMessage(
                    "Role updated successfully."
                );

            }

            /*
            |--------------------------------------------------------------------------
            | Create New Role
            |--------------------------------------------------------------------------
            */

            else {

                await createRoleApi(
                    payload
                );

                setMessage(
                    "Role created successfully."
                );
            }


            /*
            |--------------------------------------------------------------------------
            | Close
            |--------------------------------------------------------------------------
            */

            setShowModal(false);

            resetForm();


            /*
            |--------------------------------------------------------------------------
            | Reload latest data
            |--------------------------------------------------------------------------
            */

            await loadData();

        } catch (err) {

            console.error(
                "Failed to save role:",
                err
            );

            setError(
                err?.message ||
                "Failed to save role."
            );

        } finally {

            setSaving(false);
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Delete Role
    |--------------------------------------------------------------------------
    */

    const removeRole = async (
        role
    ) => {

        if (!role?.id) {
            return;
        }


        /*
        |--------------------------------------------------------------------------
        | Protect SUPER_ADMIN
        |--------------------------------------------------------------------------
        */

        if (
            role.name ===
            "SUPER_ADMIN"
        ) {

            return;
        }


        const confirmed =
            window.confirm(
                `Delete role "${role.name}"?`
            );

        if (!confirmed) {
            return;
        }


        try {

            setError("");
            setMessage("");


            await deleteRoleApi(
                role.id
            );


            setMessage(
                "Role deleted successfully."
            );


            await loadData();

        } catch (err) {

            console.error(
                "Failed to delete role:",
                err
            );

            setError(
                err?.message ||
                "Failed to delete role."
            );
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loading) {

        return (

            <div className="rounded-2xl bg-white p-8 shadow-sm">

                <p className="text-sm text-slate-500">
                    Loading roles...
                </p>

            </div>
        );
    }


    /*
    |--------------------------------------------------------------------------
    | UI
    |--------------------------------------------------------------------------
    */

    return (

        <div className="space-y-6">

            {/* -----------------------------------------------------------------
                Header
            ----------------------------------------------------------------- */}

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


            {/* -----------------------------------------------------------------
                Success Message
            ----------------------------------------------------------------- */}

            {message && (

                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">

                    {message}

                </div>
            )}


            {/* -----------------------------------------------------------------
                Error Message
            ----------------------------------------------------------------- */}

            {error && !showModal && (

                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

                    {error}

                </div>
            )}


            {/* -----------------------------------------------------------------
                Roles Table
            ----------------------------------------------------------------- */}

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

                            {roles.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="5"
                                        className="px-6 py-10 text-center text-sm text-slate-500"
                                    >
                                        No roles found.
                                    </td>

                                </tr>

                            ) : (

                                roles.map(
                                    (role) => (

                                        <tr
                                            key={role.id}
                                            className="border-b border-slate-100 last:border-0"
                                        >

                                            {/* Role */}

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


                                            {/* Permissions */}

                                            <td className="px-6 py-4">

                                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">

                                                    {
                                                        role.permissions?.length ||
                                                        0
                                                    }

                                                </span>

                                            </td>


                                            {/* Employees */}

                                            <td className="px-6 py-4 text-sm text-slate-600">

                                                {
                                                    role._count?.users ||
                                                    0
                                                }

                                            </td>


                                            {/* Status */}

                                            <td className="px-6 py-4">

                                                <span
                                                    className={
                                                        `rounded-full px-3 py-1 text-xs font-semibold ${
                                                            role.isActive
                                                                ? "bg-emerald-50 text-emerald-700"
                                                                : "bg-slate-100 text-slate-500"
                                                        }`
                                                    }
                                                >

                                                    {
                                                        role.isActive
                                                            ? "Active"
                                                            : "Inactive"
                                                    }

                                                </span>

                                            </td>


                                            {/* Actions */}

                                            <td className="px-6 py-4 text-right">

                                                <div className="flex justify-end gap-2">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openEdit(
                                                                role
                                                            )
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
                                                                removeRole(
                                                                    role
                                                                )
                                                            }
                                                            className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                                                        >
                                                            Delete
                                                        </button>

                                                    )}

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* -----------------------------------------------------------------
                Create / Edit Modal
            ----------------------------------------------------------------- */}

            {showModal && (

                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4">

                    <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

                        {/* -----------------------------------------------------
                            Modal Header
                        ----------------------------------------------------- */}

                        <div className="border-b border-slate-200 px-6 py-5">

                            <div className="flex items-center justify-between">

                                <div>

                                    <h2 className="text-lg font-bold text-slate-900">

                                        {
                                            editingRole
                                                ? "Edit Role"
                                                : "Create Role"
                                        }

                                    </h2>

                                    <p className="mt-1 text-xs text-slate-500">
                                        Select the permissions this role should have.
                                    </p>

                                </div>


                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={saving}
                                    className="text-xl text-slate-400 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    ×
                                </button>

                            </div>

                        </div>


                        {/* -----------------------------------------------------
                            Form
                        ----------------------------------------------------- */}

                        <form
                            onSubmit={saveRole}
                            className="space-y-6 p-6"
                        >

                            {/* -------------------------------------------------
                                Basic Details
                            ------------------------------------------------- */}

                            <div className="grid gap-4 sm:grid-cols-2">

                                {/* Role Name */}

                                <div>

                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Role Name
                                    </label>

                                    <input
                                        value={name}
                                        onChange={(e) =>
                                            setName(
                                                e.target.value
                                            )
                                        }
                                        placeholder="e.g. Sales Manager"
                                        className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
                                    />

                                </div>


                                {/* Description */}

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
                                        className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
                                    />

                                </div>

                            </div>


                            {/* -------------------------------------------------
                                Active
                            ------------------------------------------------- */}

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


                            {/* -------------------------------------------------
                                Permissions
                            ------------------------------------------------- */}

                            <div>

                                {/* Permission Header */}

                                <div className="mb-4 flex items-center justify-between">

                                    <div>

                                        <h3 className="text-sm font-bold text-slate-900">
                                            Permissions
                                        </h3>

                                        <p className="mt-1 text-xs text-slate-400">
                                            {totalPermissions} permissions available
                                        </p>

                                    </div>


                                    <span className="text-xs font-medium text-slate-500">

                                        {selectedPermissions.length}
                                        {" "}
                                        selected

                                    </span>

                                </div>


                                {/* No Permissions */}

                                {permissions.length === 0 ? (

                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">

                                        <p className="text-sm font-medium text-slate-700">
                                            No permissions available.
                                        </p>

                                        <p className="mt-1 text-xs text-slate-500">
                                            Please check the backend permissions API and database seed.
                                        </p>

                                    </div>

                                ) : (

                                    <div className="space-y-4">

                                        {sortedGroups.map(
                                            (
                                                [
                                                    groupName,
                                                    groupPermissions
                                                ]
                                            ) => {

                                                /*
                                                |--------------------------------------------------------------------------
                                                | Group IDs
                                                |--------------------------------------------------------------------------
                                                */

                                                const groupIds =
                                                    groupPermissions
                                                        .map(
                                                            (
                                                                permission
                                                            ) =>
                                                                permission?.id
                                                        )
                                                        .filter(
                                                            Boolean
                                                        );


                                                /*
                                                |--------------------------------------------------------------------------
                                                | Check All
                                                |--------------------------------------------------------------------------
                                                */

                                                const allSelected =
                                                    groupIds.length >
                                                        0 &&
                                                    groupIds.every(
                                                        (
                                                            id
                                                        ) =>
                                                            selectedPermissions.includes(
                                                                id
                                                            )
                                                    );


                                                /*
                                                |--------------------------------------------------------------------------
                                                | Selected Count
                                                |--------------------------------------------------------------------------
                                                */

                                                const selectedCount =
                                                    groupIds.filter(
                                                        (
                                                            id
                                                        ) =>
                                                            selectedPermissions.includes(
                                                                id
                                                            )
                                                    ).length;


                                                return (

                                                    <div
                                                        key={
                                                            groupName
                                                        }
                                                        className="overflow-hidden rounded-xl border border-slate-200"
                                                    >

                                                        {/* -------------------------------------------------
                                                            Group Header
                                                        ------------------------------------------------- */}

                                                        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">

                                                            <div>

                                                                <p className="text-sm font-semibold text-slate-800">
                                                                    {
                                                                        groupName
                                                                    }
                                                                </p>

                                                                <p className="mt-0.5 text-[11px] text-slate-400">

                                                                    {
                                                                        selectedCount
                                                                    }
                                                                    /
                                                                    {
                                                                        groupIds.length
                                                                    }
                                                                    selected

                                                                </p>

                                                            </div>


                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    toggleGroup(
                                                                        groupPermissions
                                                                    )
                                                                }
                                                                className="text-xs font-semibold text-slate-600 hover:text-slate-950"
                                                            >

                                                                {
                                                                    allSelected
                                                                        ? "Clear all"
                                                                        : "Select all"
                                                                }

                                                            </button>

                                                        </div>


                                                        {/* -------------------------------------------------
                                                            Permission List
                                                        ------------------------------------------------- */}

                                                        <div className="grid gap-2 p-4 sm:grid-cols-2">

                                                            {groupPermissions.map(
                                                                (
                                                                    permission
                                                                ) => {

                                                                    const isSelected =
                                                                        selectedPermissions.includes(
                                                                            permission.id
                                                                        );


                                                                    return (

                                                                        <label
                                                                            key={
                                                                                permission.id
                                                                            }
                                                                            className={`flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2.5 transition ${
                                                                                isSelected
                                                                                    ? "border-slate-300 bg-slate-50"
                                                                                    : "border-transparent hover:bg-slate-50"
                                                                            }`}
                                                                        >

                                                                            <input
                                                                                type="checkbox"
                                                                                checked={
                                                                                    isSelected
                                                                                }
                                                                                onChange={() =>
                                                                                    togglePermission(
                                                                                        permission.id
                                                                                    )
                                                                                }
                                                                                className="mt-0.5 h-4 w-4 rounded"
                                                                            />


                                                                            <div className="min-w-0">

                                                                                <span className="block break-words text-sm font-medium text-slate-700">

                                                                                    {
                                                                                        permission.code
                                                                                    }

                                                                                </span>


                                                                                {permission.description && (

                                                                                    <p className="mt-0.5 text-xs leading-5 text-slate-400">

                                                                                        {
                                                                                            permission.description
                                                                                        }

                                                                                    </p>

                                                                                )}

                                                                            </div>

                                                                        </label>

                                                                    );
                                                                }
                                                            )}

                                                        </div>

                                                    </div>

                                                );
                                            }
                                        )}

                                    </div>

                                )}

                            </div>


                            {/* -------------------------------------------------
                                Modal Error
                            ------------------------------------------------- */}

                            {error && (

                                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

                                    {error}

                                </div>

                            )}


                            {/* -------------------------------------------------
                                Actions
                            ------------------------------------------------- */}

                            <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">

                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={saving}
                                    className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
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