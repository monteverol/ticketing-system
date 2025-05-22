import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RoleBasedRoute from "./components/RoleBasedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <RoleBasedRoute allowedRoles={["employee", "manager", "admin"]}>
              <Dashboard />
            </RoleBasedRoute>
          }
        />
        <Route path="*" element={<p className="text-center mt-10">404 - Not Found</p>} />
      </Routes>
    </BrowserRouter>
  );
}