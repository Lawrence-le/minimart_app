// frontend\src\routes\AdminRoutes.jsx

import { Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AdminPanel from "../pages/AdminPanel";
import Report from "../pages/Report";

const AdminRoutes = () => {
  const { user } = useAuth();

  if (!user || user.role !== "admin") {
    return <Navigate to="/" />;
  }

  return (
    <div className="admin-routes">
      <Routes>
        <Route path="report" element={<Report />} />
        <Route path="manager" element={<AdminPanel />} />
      </Routes>
    </div>
  );
};

export default AdminRoutes;
