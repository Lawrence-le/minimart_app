// frontend\src\routes\AdminRoutes.jsx

import { Route, Routes } from "react-router-dom";
import AdminPanel from "../pages/AdminPanel";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

// import CategoryManager from "../pages/CategoryManager";
// import ProductManager from "../pages/ProductManager";
import Report from "../pages/Report";

const AdminRoutes = () => {
  const { user } = useAuth();

  if (!user || user.role !== "admin") {
    return <Navigate to="/" />;
  }

  return (
    <Routes>
      <Route path="report" element={<Report />} />
      <Route path="manager" element={<AdminPanel />} />
      {/* <Route path="categories" element={<CategoryManager />} />
        <Route path="products" element={<ProductManager />} />
      </Route> */}
    </Routes>
  );
};

export default AdminRoutes;
