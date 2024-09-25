import { Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import "bootstrap/dist/css/bootstrap.min.css";

import ProtectedRoutes from "./routes/ProtectedRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import PublicNavbar from "./components/PublicNavbar";
import UserNavbar from "./components/UserNavbar";
import AdminNavbar from "./components/AdminNavbar";
import Home from "./pages/Home";
import SearchResult from "./pages/SearchResults";
import Store from "./pages/Store";
import Product from "./pages/Product";
import Footer from "./components/Footer";

import { getToken } from "./utils/tokenUtils";
import "./styles/globalStyles.css";

const App = () => {
  // let Navbar;
  // Navbar = PublicNavbar;
  // Navbar = UserNavbar;
  // Navbar = AdminNavbar;

  const { user } = useAuth();
  console.log("Current user:", user);
  console.log("User Token: ", getToken());
  // console.log("User Role: ", user.role);

  let Navbar;

  if (user) {
    switch (user.role) {
      case "admin":
        Navbar = AdminNavbar;
        console.log("User Role: ", user.role);
        break;

      case "user":
        Navbar = UserNavbar;
        console.log("User Role: ", user.role);
        break;

      default:
        Navbar = PublicNavbar;
        break;
    }
  } else {
    Navbar = PublicNavbar;
  }

  return (
    <>
      <Navbar />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/store" element={<Store />} />
        <Route path="/search" element={<SearchResult />} />
        <Route path="/product/:productId" element={<Product />} />

        {/* Protected routes */}
        <Route path="/*" element={<ProtectedRoutes />} />

        {/* Admin routes */}
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>

      <Footer />
    </>
  );
};

export default App;
