//frontend\src\context\CartContext.jsx
import { createContext, useState, useContext } from "react";

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

const shippingCharge = 5; //! SET SHIPPING COST

export const CartProvider = ({ children }) => {
  const [shippingCost] = useState(shippingCharge.toFixed(2)); //! SET SHIPPING COST

  return (
    <CartContext.Provider value={{ shippingCost }}>
      {children}
    </CartContext.Provider>
  );
};
