// frontend/src/services/paymentService.js

import axios from "axios";
import { apiUrl } from "./apiUrl";
import { getToken } from "../utils/tokenUtils";

export const createCheckoutSession = async (orderData) => {
  try {
    const token = getToken();
    const response = await axios.post(
      `${apiUrl}/api/payments/create-checkout-session`,
      orderData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating Stripe checkout session:", error);
    throw error;
  }
};

export const paymentService = {
  createCheckoutSession: async (totalOrder) => {
    try {
      const token = getToken();
      const response = await axios.post(
        `${apiUrl}/api/payments/create-checkout-session`,
        {
          total_amount: totalOrder,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating checkout session:", error);
      throw error;
    }
  },
};

// export const retrieveSession = async (sessionId) => {
//   try {

//     const token = getToken();
//     const headers = {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     };

//     const response = await axios.post(
//       `${apiUrl}/payments/retrieve-session`,
//       { session_id: sessionId },
//       { headers }
//     );

//     return response.data;
//   } catch (error) {
//     console.error(
//       "Error retrieving session:",
//       error.response?.data || error.message
//     );
//     throw error;
//   }
// };
