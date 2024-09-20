import axios from "axios";
import { apiUrl } from "./apiUrl";
import { getToken } from "../utils/tokenUtils";

const API_URL = `${apiUrl}/api/products`;
const token = getToken();

// Get all products
export const getProducts = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to fetch products");
  }
};

// Get a single product by ID
export const getProductById = async (productId) => {
  try {
    const response = await axios.get(`${API_URL}/${productId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to fetch product");
  }
};

// Search products by name or description
export const searchProducts = async (query) => {
  try {
    const response = await axios.get(`${API_URL}/search`, {
      params: { q: query },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Error searching products");
  }
};

// Filter products by category
export const filterProductsByCategory = async (categoryId) => {
  try {
    const response = await axios.get(
      `${API_URL}/filter/category/${categoryId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to filter products by category"
    );
  }
};

// Add a new product
export const addProduct = async (productData) => {
  try {
    const response = await axios.post(API_URL, productData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to add product");
  }
};

// Update an existing product
export const updateProduct = async (productId, productData) => {
  try {
    const token = getToken();
    const response = await axios.put(`${API_URL}/${productId}`, productData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to update product");
  }
};

// Delete a product
export const deleteProduct = async (productId) => {
  try {
    const response = await axios.delete(`${API_URL}/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to delete product");
  }
};

export const uploadProductImage = async (file) => {
  const token = getToken();
  const formData = new FormData();
  // formData.append("image", file);
  formData.append("file", file);

  try {
    const response = await axios.post(
      // "http://localhost:5000/api/products/upload_image",
      // formData,
      `${API_URL}/upload_image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

// Update a product image
export const updateProductImage = async (productId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.put(
      `${API_URL}/update_image/${productId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to update image");
  }
};

// Delete a product image
export const deleteProductImage = async (productId) => {
  try {
    const token = getToken();
    const response = await axios.delete(
      `${API_URL}/delete_image/${productId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to delete image");
  }
};
