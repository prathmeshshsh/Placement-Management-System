import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children, allowedRole }) {
  const location = useLocation();
  const token = localStorage.getItem("accessToken");
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true" && Boolean(token);
  const role = localStorage.getItem("role");

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRole && role !== allowedRole) {
    return <Navigate to={role === "Admin" ? "/dashboard" : role === "Student" ? "/student-dashboard" : role === "Company" ? "/company-dashboard" : "/login"} replace />;
  }

  return children;
}

export default ProtectedRoute;
