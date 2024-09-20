// frontend\src\services\adminService.js

import axios from "axios";
import { apiUrl } from "../apiUrl"; // Adjust the path as necessary

const ADMIN_API_URL = `${apiUrl}/api/admin`;

//* Admin Registration
// export const registerAdmin = async (username, password) => {
//   try {
//     const response = await axios.post(`${ADMIN_API_URL}/register`, {
//       username,
//       password,
//     });
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || error.message;
//   }
// };

//* Admin Login
export const loginAdmin = async (username, password) => {
  try {
    const response = await axios.post(`${ADMIN_API_URL}/login`, {
      username,
      password,
    });
    const { access_token } = response.data;
    localStorage.setItem("accessToken", access_token);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

//* Admin Logout
export const logoutAdmin = async () => {
  try {
    await axios.post(`${ADMIN_API_URL}/logout`, null, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    localStorage.removeItem("accessToken");
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

//* Get Admin Protected Data
export const getAdminProtectedData = async () => {
  try {
    const response = await axios.get(`${ADMIN_API_URL}/protected`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
