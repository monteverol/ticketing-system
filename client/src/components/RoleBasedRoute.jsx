import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function RoleBasedRoute({ allowedRoles, children }) {
  const { user, loading } = useAuth();

  if (loading) return <p>Checking authentication...</p>; // or return a spinner

  if (!user) return <Navigate to="/login" />;

  if (!allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" />;

  return typeof children === "function" ? children(user) : children;
}