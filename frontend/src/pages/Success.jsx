import { Container } from "react-bootstrap";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { confirmOrderStatus } from "../services/ordersService";

const layout = {
  marginTop: "10rem",
};

const Success = () => {
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const orderId = queryParams.get("order_id");

    if (orderId) {
      confirmOrderStatus(orderId)
        .then((response) => {
          console.log("Order status confirmed:", response);
        })
        .catch((error) => {
          console.error("Error confirming order status:", error);
        });
    }
  }, [location]);

  return (
    <Container style={layout}>
      <h2>Payment Success!</h2>
    </Container>
  );
};

export default Success;
