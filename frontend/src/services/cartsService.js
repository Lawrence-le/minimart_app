// frontend/src/services/cartService.js
import axios from "axios";
import { apiUrl } from "./apiUrl";
import { getToken } from "../utils/tokenUtils";

const API_URL = `${apiUrl}/api/carts`;

const headers = () => {
  const token = getToken();
  return { Authorization: `Bearer ${token}` };
};

// Add an empty cart during sign up
export const createEmptyCart = async (userId) => {
  try {
    const response = await axios.post(
      `${API_URL}/create_empty`,
      { user_id: userId },
      { headers: headers() }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Add a product to the cart
export const addToCart = async (productId, quantity) => {
  const payload = { product_id: productId, quantity };
  // console.log("Payload:", payload); // Log the payload

  try {
    const response = await axios.post(
      `${API_URL}/add`,
      payload, // Use the payload variable instead of repeating the object
      { headers: headers() }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update the quantity of a product in the cart
export const updateCartQuantity = async (productId, quantity) => {
  try {
    const response = await axios.put(
      `${API_URL}/update/${productId}`,
      { quantity },
      { headers: headers() }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Remove a product from the cart
export const removeFromCart = async (productId) => {
  try {
    const response = await axios.delete(`${API_URL}/remove/${productId}`, {
      headers: headers(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get all cart items
export const getCartItems = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: headers(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Clear the cart
export const clearCart = async () => {
  try {
    const response = await axios.delete(`${API_URL}/clear`, {
      headers: headers(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
// Get Cart Total
export const getCartTotal = async () => {
  try {
    const response = await axios.get(`${API_URL}/total`, {
      // updated
      headers: headers(),
    });
    return response.data.total;
  } catch (error) {
    console.error("Error fetching cart total", error);
    throw error;
  }
};

// Get All Cart Products
export const getCartProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products`, {
      headers: headers(),
    });
    return response.data.cart_products;
  } catch (error) {
    console.error("Error fetching cart products", error);
    throw error;
  }
};
