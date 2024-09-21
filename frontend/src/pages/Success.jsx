// Success.jsx

import { Container } from "react-bootstrap";

const layout = {
  marginTop: "10rem",
};

const Success = () => {
  return (
    <Container style={layout}>
      <h1 className="mt-5">Payment Successful!</h1>
      <p>Thank you for your purchase!</p>
    </Container>
  );
};

export default Success;
