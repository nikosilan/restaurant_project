import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, requireRole }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/admin-login" replace />;
  }

  if (requireRole && user.role !== requireRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
