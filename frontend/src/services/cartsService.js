// frontend/src/services/cartService.js
import axios from "axios";
import { apiUrl } from "./apiUrl";
import { getToken } from "../utils/tokenUtils";

const API_URL = `${apiUrl}/api/carts`;

const getAuthHeaders = () => {
  const token = getToken();
  return { Authorization: `Bearer ${token}` };
};

// Add an empty cart during sign up
export const createEmptyCart = async (userId) => {
  try {
    const response = await axios.post(
      `${API_URL}/create_empty`,
      { user_id: userId },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Add a product to the cart
export const addToCart = async (productId, quantity = 1) => {
  try {
    const response = await axios.post(
      `${API_URL}/add`,
      { product_id: productId, quantity },
      { headers: getAuthHeaders() }
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
      { headers: getAuthHeaders() }
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
      headers: getAuthHeaders(),
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
      headers: getAuthHeaders(),
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
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
