// frontend\src\components\Payment.jsx

import { useCallback, useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import paymentService from "../services/paymentService";
import { getUserOrders } from "../services/ordersService";

// Load your Stripe public key
const stripePromise = loadStripe(
  "pk_test_51Q1RBrP8pK8VXx3sdxD0sTGMLLsf9ECvf97duyZFRSxKaZfAKJnZDj10OAe5cS5WGAuf4RMHT4C9uCpOMIWT9kaw006HhBvs7z"
);

const CheckoutForm = () => {
  const [totalOrder, setTotalOrder] = useState(0);
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState(null);

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    const fetchTotalOrder = async () => {
      try {
        const response = await getUserOrders();
        const orders = response.orders;

        if (orders.length === 0) {
          setTotalOrder(0);
          return;
        }

        const lastOrder = orders[orders.length - 1];
        setTotalOrder(lastOrder.total * 100); // Convert to cents
      } catch (error) {
        console.error("Error fetching user orders:", error);
      }
    };

    fetchTotalOrder();
  }, []);

  const fetchClientSecret = useCallback(async () => {
    if (totalOrder > 0) {
      try {
        const data = await paymentService.createCheckoutSession(totalOrder);
        console.log("Checkout session data:", data); // Check the response data
        setClientSecret(data.client_secret); // Assuming client_secret is returned
      } catch (error) {
        console.error("Error creating checkout session:", error);
      }
    }
  }, [totalOrder]);

  useEffect(() => {
    fetchClientSecret(); // Call after totalOrder is set
  }, [totalOrder, fetchClientSecret]);

  useEffect(() => {
    console.log("Client Secret: ", clientSecret);
  }, [clientSecret]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    const cardElement = elements.getElement(CardElement);

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
        },
      }
    );

    if (error) {
      setError(error.message);
    } else {
      console.log("Payment successful:", paymentIntent);
      // Handle success (e.g., redirect, show a success message, etc.)
    }
  };

  return (
    <div id="checkout" className="cart-container mt-4">
      {clientSecret ? (
        <form onSubmit={handleSubmit}>
          <CardElement className="card-element" />
          {error && <div>{error}</div>}
          <button type="submit" disabled={!stripe || !clientSecret}>
            Pay
          </button>
        </form>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );

  // return (
  //   <div id="checkout">
  //     {clientSecret ? (
  //       <form onSubmit={handleSubmit}>
  //         <CardElement />
  //         {error && <div>{error}</div>}
  //         <button type="submit" disabled={!stripe || !clientSecret}>
  //           Pay
  //         </button>
  //       </form>
  //     ) : (
  //       <div>Loading...</div>
  //     )}
  //   </div>
  // );
};

// Wrap CheckoutForm with Elements in the parent component
const Payment = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default Payment;
