import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useState } from "react";
import useAuth from "../hooks/useAuth.js";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const {
    user,
    logout,
    hasPermission,
  } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();

    navigate("/login", {
      replace: true,
    });
  };

  const navClass = (path) => {
    const active = location.pathname === path;

    return `flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${active
        ? "bg-white text-slate-950 shadow-sm"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
      }`;
  };

  return (
    <div className="min-h-screen bg-slate-100">

      {/* =========================
          SIDEBAR
      ========================== */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex flex-col
          border-r border-slate-800
          bg-slate-950
          text-white
          shadow-xl
          transition-all duration-300 ease-in-out
          ${sidebarOpen
            ? "w-64 translate-x-0"
            : "w-0 -translate-x-full overflow-hidden"
          }
        `}
      >

        {/* Sidebar Header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800 px-5">

          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold text-white">
              Travel CRM
            </h1>

            <p className="truncate text-xs text-slate-500">
              Management System
            </p>
          </div>

          {/* CLOSE SIDEBAR */}
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            title="Close sidebar"
            className="
              ml-3 flex h-9 w-9 shrink-0
              items-center justify-center
              rounded-lg
              border border-slate-800
              bg-slate-900
              text-slate-400
              transition
              hover:bg-slate-800
              hover:text-white
            "
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 6l-6 6 6 6"
              />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">

          {/* Dashboard */}
          <Link
            to="/dashboard"
            className={navClass("/dashboard")}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="mr-3 h-5 w-5 shrink-0"
            >
              <rect
                x="3"
                y="3"
                width="7"
                height="7"
                rx="1"
              />
              <rect
                x="14"
                y="3"
                width="7"
                height="7"
                rx="1"
              />
              <rect
                x="3"
                y="14"
                width="7"
                height="7"
                rx="1"
              />
              <rect
                x="14"
                y="14"
                width="7"
                height="7"
                rx="1"
              />
            </svg>

            Dashboard
          </Link>

          {/* Employees */}
          {hasPermission("EMPLOYEE_READ") && (
            <Link
              to="/employees"
              className={navClass("/employees")}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="mr-3 h-5 w-5 shrink-0"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"
                />
                <circle
                  cx="9"
                  cy="7"
                  r="4"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
                />
              </svg>

              Employees
            </Link>
          )}

          {/* Leads */}
          {hasPermission("LEAD_READ") && (
            <Link
              to="/leads"
              className={navClass("/leads")}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="mr-3 h-5 w-5 shrink-0"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
                />
                <circle
                  cx="12"
                  cy="7"
                  r="4"
                />
              </svg>

              Leads
            </Link>
          )}

          {/* Emails */}
          {hasPermission("EMAIL_CREATE") && (
            <Link
              to="/emails"
              className={navClass("/emails")}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="mr-3 h-5 w-5 shrink-0"
              >
                <rect
                  x="3"
                  y="5"
                  width="18"
                  height="14"
                  rx="2"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 7l9 6 9-6"
                />
              </svg>

              Emails
            </Link>
          )}

          {/* Roles & Access */}
          {hasPermission("ROLE_READ") && (
            <Link
              to="/roles"
              className={navClass("/roles")}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="mr-3 h-5 w-5 shrink-0"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4z"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4"
                />
              </svg>

              Roles & Access
            </Link>
          )}





        </nav>

        {/* User Section */}
        <div className="shrink-0 border-t border-slate-800 p-4">

          <div className="rounded-xl bg-slate-900 p-3">

            <p className="truncate text-sm font-semibold text-white">
              {user?.name}
            </p>

            <p className="mt-1 truncate text-xs text-slate-500">
              {user?.email}
            </p>

            <span className="mt-3 inline-flex rounded-full bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-slate-300">
              {user?.role}
            </span>

          </div>
        </div>
      </aside>


      {/* =========================
          MAIN AREA
      ========================== */}
      <div
        className={`
          min-h-screen
          transition-all duration-300 ease-in-out
          ${sidebarOpen
            ? "lg:pl-64"
            : "pl-0"
          }
        `}
      >

        {/* =========================
            TOPBAR
        ========================== */}
        <header
          className="
            sticky top-0 z-40
            flex h-16
            items-center justify-between
            border-b border-slate-200
            bg-white/95
            px-4
            backdrop-blur
            sm:px-6
          "
        >

          <div className="flex items-center gap-3">

            {/* OPEN SIDEBAR BUTTON */}
            {!sidebarOpen && (
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                title="Open sidebar"
                className="
                  flex h-10 w-10
                  items-center justify-center
                  rounded-xl
                  border border-slate-200
                  bg-white
                  text-slate-700
                  shadow-sm
                  transition
                  hover:bg-slate-50
                  hover:text-slate-950
                "
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 6l6 6-6 6"
                  />
                </svg>
              </button>
            )}

            <div>
              <p className="text-sm font-semibold text-slate-900">
                {user?.role === "SUPER_ADMIN"
                  ? "Administration"
                  : "Sales Workspace"}
              </p>

              <p className="hidden text-xs text-slate-500 sm:block">
                Travel CRM Management System
              </p>
            </div>

          </div>


          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3">

            {/* User Info */}
            <div className="hidden text-right md:block">

              <p className="text-sm font-semibold text-slate-800">
                {user?.name}
              </p>

              <p className="text-xs text-slate-500">
                {user?.role}
              </p>

            </div>

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="
                rounded-lg
                border border-slate-300
                bg-white
                px-3 py-2
                text-sm font-medium
                text-slate-700
                transition
                hover:bg-slate-50
                hover:text-slate-950
              "
            >
              Logout
            </button>

          </div>

        </header>


        {/* =========================
            CONTENT
        ========================== */}
        <main className="min-w-0 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;