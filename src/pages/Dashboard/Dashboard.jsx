import useAuth from "../../hooks/useAuth.js";

const Dashboard = () => {
  const { user } = useAuth();

  const isAdmin =
    user?.role === "SUPER_ADMIN";

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Welcome back, {user?.name}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Role
          </p>

          <p className="mt-2 text-lg font-bold text-slate-950">
            {user?.role}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Permissions
          </p>

          <p className="mt-2 text-lg font-bold text-slate-950">
            {user?.permissions?.length || 0}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Workspace
          </p>

          <p className="mt-2 text-lg font-bold text-slate-950">
            {isAdmin
              ? "Admin"
              : "Sales"}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Status
          </p>

          <p className="mt-2 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
            Active
          </p>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;