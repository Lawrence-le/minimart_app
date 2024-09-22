import React from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import "bootstrap/dist/css/bootstrap.min.css";
import NotFound from "./components/NotFound";

import PublicRoutes from "./routes/PublicRoutes";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import PublicNavbar from "./components/PublicNavbar";
import UserNavbar from "./components/UserNavbar";
import AdminNavbar from "./components/AdminNavbar";

import Payment from "./components/Payment";

import "./styles/globalStyles.css";
// import PublicHeader from "./components/PublicHeader";
// import Profile from "./pages/Profile";
import Home from "./pages/Home";
import { getToken } from "./utils/tokenUtils";

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
      {/* <PublicHeader /> */}
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/store" element={<PublicRoutes />} />
        <Route path="/search" element={<PublicRoutes />} />
        <Route path="/product" element={<PublicRoutes />} />
        <Route path="/login" element={<PublicRoutes />} />
        <Route path="/register" element={<PublicRoutes />} />

        {/* Protected routes */}
        <Route path="/*" element={<ProtectedRoutes />} />
        {/* <Route path="/profile" element={<Profile />} /> */}

        {/* <Route path="/checkout" element={<ProtectedRoutes />} />
        <Route path="/payment" element={<ProtectedRoutes />} />
        <Route path="/myorders" element={<ProtectedRoutes />} />
        <Route path="/orderconfirmation" element={<ProtectedRoutes />} /> */}

        {/* Admin routes */}
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </>
  );
};

export default App;
