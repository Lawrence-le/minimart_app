// frontend\src\services\userService.js

import axios from "axios";
import { apiUrl } from "./apiUrl";
import { setToken, getToken } from "../utils/tokenUtils";

const USER_API_URL = `${apiUrl}/api/user`;
const token = getToken();

//* User Registration
export const registerUser = async (
  username,
  email,
  password,
  first_name,
  last_name
) => {
  try {
    const response = await axios.post(`${USER_API_URL}/register`, {
      username,
      email,
      password,
      first_name,
      last_name,
    });
    return response.data.user; // Adjust this line to return the user object directly
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

//* User Login
export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${USER_API_URL}/login`, {
      username,
      password,
    });
    return response.data; // Return the entire response data
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

//* User Logout

export const logoutUser = async () => {
  try {
    await axios.post(`${USER_API_URL}/logout`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

//* Get User Protected Data
export const getUserProtectedData = async () => {
  const user_token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("No access token found. Please login.");
  }

  try {
    const response = await axios.get(`${USER_API_URL}/protected`, {
      headers: {
        Authorization: `Bearer ${user_token}`,
      },
    });

    console.log("Protected Data Response:", response.data);

    return response.data;
  } catch (error) {
    console.error("Error fetching protected data:", error);
    throw error.response?.data || error.message;
  }
};
