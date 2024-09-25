import axios from "axios";
import { apiUrl } from "./apiUrl";
import { getToken } from "../utils/tokenUtils";

const API_URL = `${apiUrl}/api/categories`;

// Get all categories
export const getCategories = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to fetch categories"
    );
  }
};

// Get a single category by ID
export const getCategory = async (categoryId) => {
  try {
    const response = await axios.get(`${API_URL}/${categoryId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to fetch category");
  }
};

// Add a new category
export const addCategory = async (categoryData) => {
  try {
    const token = getToken();
    const response = await axios.post(API_URL, categoryData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to add category");
  }
};

// Update an existing category
export const updateCategory = async (categoryId, categoryData) => {
  const token = getToken(); // Retrieve the token from storage or context

  try {
    const token = getToken();
    const response = await axios.put(`${API_URL}/${categoryId}`, categoryData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to update category");
  }
};

// Delete a category
export const deleteCategory = async (categoryId) => {
  try {
    const token = getToken();
    const response = await axios.delete(`${API_URL}/${categoryId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to delete category");
  }
};
