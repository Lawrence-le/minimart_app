// frontend\src\context\AuthContext.jsx

import { createContext, useState, useContext } from "react";
import {
  setToken,
  getToken,
  decodeToken,
  removeToken,
} from "../utils/tokenUtils";
import { logoutUser } from "../services/userService"; // Ensure this import is correct

// Create a Context for Auth
const AuthContext = createContext();

// Custom hook for using AuthContext
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = getToken();
    if (token) {
      return decodeToken(token);
    }
    return null;
  });

  const login = (token) => {
    console.log("Token received for login:", token); // Log the received token
    setToken(token);
    const decodedUser = decodeToken(token);
    console.log("User decoded:", decodedUser);
    setUser(decodedUser);
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      removeToken();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
