import axios from "axios";
import { apiUrl } from "./apiUrl";
import { getToken } from "../utils/tokenUtils";

const API_URL = `${apiUrl}/api/orders`;
// const token = getToken();

// Create order
export const createOrder = async (orderData) => {
  const token = getToken();
  const response = await axios.post(`${API_URL}`, orderData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Get user orders
export const getUserOrders = async () => {
  const token = getToken();
  const response = await axios.get(`${API_URL}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Get order details
export const getOrderDetails = async (orderId) => {
  const token = getToken();
  const response = await axios.get(`${API_URL}/${orderId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Confirm order status
export const confirmOrderStatus = async (orderId) => {
  const token = getToken();

  try {
    const response = await axios.put(
      `${API_URL}/${orderId}/confirm`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

//! ADMIN ROUTES /////////////////////////////////////////////////////////////

//* Get All Orders [by admin]
export const getAllOrders = async () => {
  const token = getToken();

  try {
    const response = await axios.get(`${API_URL}/admin/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

//* Get Order Items by Order ID [by admin]
export const getOrderItemsByOrderId = async (orderId) => {
  const token = getToken();

  try {
    const response = await axios.get(`${API_URL}/admin/items/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

//* Set Status to Shipped [by admin]
export const updateStatusShipped = async (orderId) => {
  const token = getToken();

  try {
    const response = await axios.put(
      `${API_URL}/admin/shipped/${orderId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
