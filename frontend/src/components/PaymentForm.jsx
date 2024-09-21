import React, { useCallback, useMemo } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

// The CheckoutForm component
const CheckoutForm = () => {
  // Memoize the stripePromise to avoid recreating the Stripe object on every render
  const stripePromise = useMemo(
    () =>
      loadStripe(
        "pk_test_51Q1RBrP8pK8VXx3sdxD0sTGMLLsf9ECvf97duyZFRSxKaZfAKJnZDj10OAe5cS5WGAuf4RMHT4C9uCpOMIWT9kaw006HhBvs7z"
      ),
    [] // Dependency array is empty to only run once
  );

  const fetchClientSecret = useCallback(() => {
    // Call the backend to create a Checkout Session
    return fetch("http://localhost:5000/api/create-checkout-session", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => data.clientSecret);
  }, []);

  const options = { fetchClientSecret };

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
};

export default CheckoutForm;
