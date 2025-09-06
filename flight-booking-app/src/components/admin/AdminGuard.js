import React from "react";
import { Navigate } from "react-router-dom";

export default function AdminGuard({ children }) {
  const ok = localStorage.getItem("admin_logged") === "1";
  return ok ? children : <Navigate to="/admin" replace />;
}
