import {
  Navigate,
  Route,
  Routes
} from "react-router-dom";

import Login from "../pages/Login/Login.jsx";
import Dashboard from "../pages/Dashboard/Dashboard.jsx";

import DashboardLayout from "../layouts/DashboardLayout.jsx";

import ProtectedRoute from "../components/guards/ProtectedRoute.jsx";
import PublicRoute from "../components/guards/PublicRoute.jsx";
import Employees from "../pages/Employees/Employees.jsx";
import Leads from "../pages/Leads/Leads.jsx";
import EmailBuilder from "../pages/Emails/EmailBuilder.jsx";
import Acceptance from "../pages/PublicAcceptance/Acceptance.jsx";
import Roles from "../pages/Roles/Roles.jsx";

const Placeholder = ({
  title
}) => {
  return (
    <div>
      <h1>{title}</h1>
      <p>
        This module is coming next.
      </p>
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route
          path="/login"
          element={<Login />}
        />
      </Route>

      <Route
        path="/accept/:token"
        element={<Acceptance />}
      />


      <Route element={<ProtectedRoute />}>
        <Route
          element={
            <DashboardLayout />
          }
        >
          <Route
            path="/dashboard"
            element={
              <Dashboard />
            }
          />

          <Route path="/employees" element={<Employees />} />
          <Route path="/roles" element={<Roles />} />
          <Route path="/leads" element={<Leads />} />

          <Route path="/emails" element={<EmailBuilder />} />
        </Route>
      </Route>

      <Route
        path="/"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

      <Route
        path="*"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />
    </Routes>
  );
};

export default AppRoutes;