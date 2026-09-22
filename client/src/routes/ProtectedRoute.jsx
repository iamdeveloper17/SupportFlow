import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

export const ProtectedRoute = ({ children, roles }) => {
  const { user, initialized } = useAuth();

  if (!initialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;

  return children;
};

export const PublicRoute = ({ children }) => {
  const { user, initialized } = useAuth();
  if (!initialized) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};