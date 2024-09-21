// frontend/src/routes/ProtectedRoutes.jsx
import { Route, Routes } from "react-router-dom";
import Cart from "../pages/Cart";
import Profile from "../pages/Profile";
import Checkout from "../pages/Checkout";
// import Payment from "../pages/Payment";
// import MyOrders from "../pages/MyOrders";
// import OrderConfirmation from "../pages/OrderConfirmation";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoutes = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <Routes>
      <Route path="cart" element={<Cart />} />
      <Route path="profile" element={<Profile />} />
      <Route path="checkout" element={<Checkout />} />
      {/* <Route path="/payment" element={<Payment />} />
      <Route path="/myorders" element={<MyOrders />} />
      <Route path="/orderconfirmation" element={<OrderConfirmation />} />  */}
    </Routes>
  );
};

export default ProtectedRoutes;
