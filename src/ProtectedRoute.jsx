import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // Not logged in
  if (!currentUser) return <Navigate to="/login" replace />;

  // Role based protection
  if (role && currentUser.role !== role) return <Navigate to="/dashboard" replace />;

  return children;
};

export default ProtectedRoute;

