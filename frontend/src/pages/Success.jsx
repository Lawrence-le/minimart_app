import { Container } from "react-bootstrap";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import { confirmOrderStatus } from "../services/ordersService";

const layout = {
  marginTop: "10rem",
};

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const orderId = queryParams.get("order_id");

    if (orderId) {
      confirmOrderStatus(orderId)
        .then((response) => {
          // console.log("Order status confirmed:", response);
          setTimeout(() => {
            navigate("/orders");
          }, 2000);
        })
        .catch((error) => {
          console.error("Error confirming order status:", error);
        });
    }
  }, [location, navigate]);

  return (
    <Container style={layout}>
      <h2>Payment Success!</h2>
      <p>You will be redirected to your orders shortly...</p>
    </Container>
  );
};

export default Success;
