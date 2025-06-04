import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import MainWrapper from "./pages/MainWrapper";
import RoleBasedRoute from "./components/RoleBasedRoute";

import DepartmentTicketList from "./components/ui/lists/DepartmentTicketList";
import ManagerApprovalList from "./components/ui/lists/ManagerApprovalList";
import TeamOverview from "./components/manager/TeamOverview";
import AdminTicketList from "./components/ui/lists/AdminTicketList";
import UserManagement from "./components/admin/UserManagement";
import AnalyticsDashboard from "./components/admin/AnalyticsDashboard";
import SettingsPanel from "./components/shared/SettingsPanel";
import MyTicketList from "./components/ui/lists/MyTicketList";
import Dashboard from "./components/employee/Dashboard";
import HelpPanel from "./components/shared/HelpPanel";

function Unauthorized() {
  return (
    <div className="text-center mt-10">
      <h1>403 - Unauthorized</h1>
      <p>You don't have permission to access this page.</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <RoleBasedRoute allowedRoles={["employee", "manager", "admin"]}>
              <MainWrapper />
            </RoleBasedRoute>
          }
        >
          {/* Index route */}
          <Route index path="dashboard" element={<Dashboard />} />
          
          {/* Common routes */}
          <Route path="tickets" element={
            <RoleBasedRoute allowedRoles={["employee", "manager", "admin"]}>
              <MyTicketList />
            </RoleBasedRoute>
          } />
          
          <Route path="help" element={<HelpPanel />} />
          <Route path="settings" element={<SettingsPanel />} />

          {/* Manager-specific routes */}
          <Route path="approvals" element={
            <RoleBasedRoute allowedRoles={["manager"]}>
              {(user) => <ManagerApprovalList />}
            </RoleBasedRoute>
          } />
          
          <Route path="team-tickets" element={
            <RoleBasedRoute allowedRoles={["manager"]}>
              {(user) => <DepartmentTicketList department={user.department} />}
            </RoleBasedRoute>
          } />
          
          <Route path="team" element={
            <RoleBasedRoute allowedRoles={["manager"]}>
              <TeamOverview />
            </RoleBasedRoute>
          } />

          {/* Admin-specific routes */}
          <Route path="admin" element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <AdminTicketList />
            </RoleBasedRoute>
          } />
          
          <Route path="users" element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <UserManagement />
            </RoleBasedRoute>
          } />
          
          <Route path="analytics" element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <AnalyticsDashboard />
            </RoleBasedRoute>
          } />

          {/* 404 within dashboard */}
          <Route path="*" element={<p>404 - Not Found</p>} />
        </Route>
        
        {/* Global 404 */}
        <Route path="*" element={<p>404 - Not Found</p>} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </BrowserRouter>
  );
}