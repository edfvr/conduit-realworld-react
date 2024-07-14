import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { isAuthenticated } = authContext;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
