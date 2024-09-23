import axios from "axios";
import { apiUrl } from "./apiUrl";
import { getToken } from "../utils/tokenUtils";

const API_URL = `${apiUrl}/api/addresses`;

// Add New Address
export const addAddress = async (addressData) => {
  try {
    const token = getToken();
    const response = await axios.post(`${API_URL}/add`, addressData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding address:", error.message);
    throw error.message;
  }
};

// Update Address
export const updateAddress = async (addressId, addressData) => {
  try {
    const token = getToken();
    const response = await axios.put(
      `${API_URL}/update/${addressId}`,
      addressData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating address:", error.message);
    throw error.message;
  }
};

// Delete Address
export const deleteAddress = async (addressId) => {
  try {
    const token = getToken();
    const response = await axios.delete(`${API_URL}/delete/${addressId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting address:", error.message);
    throw error.message;
  }
};

// Get All Addresses
export const getAddresses = async () => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Addresses Data Response:", response.data);

    return response.data.addresses;
  } catch (error) {
    console.error("Error fetching addresses:", error.message);
    throw error.message;
  }
};
