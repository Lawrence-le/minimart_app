import { Container } from "react-bootstrap";
import { useEffect, useState } from "react";
import { getUserOrders } from "../services/ordersService";
import { retrieveSession } from "../services/paymentService";
import axios from "axios";

const layout = {
  marginTop: "10rem",
};

const Success = () => {
  const [sessionDetails, setSessionDetails] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get("session_id"); // Get session_id from the URL

    if (sessionId) {
      // Call the backend to retrieve session details
      axios
        .post("/api/payments/retrieve-session", { session_id: sessionId })
        .then((response) => {
          setSessionDetails(response.data); // Store session details in state
        })
        .catch((error) => {
          console.error("Error fetching session details:", error);
        });
    }
  }, []);

  return (
    <Container style={layout}>
      <h2>Payment Success!</h2>
      {sessionDetails ? (
        <div>
          <p>
            Shipping Cost: {sessionDetails.shipping_cost?.amount_total / 100}
          </p>
          <p>Order Amount: {sessionDetails.amount_total / 100}</p>
        </div>
      ) : (
        <p>Loading session details...</p>
      )}
    </Container>
  );
};

export default Success;
