// Cancel.jsx

import { Container } from "react-bootstrap";

const layout = {
  marginTop: "10rem",
};

const Cancel = () => {
  return (
    <Container style={layout}>
      <h1 className="mt-5">Payment Canceled</h1>
      <p>Your payment was not completed. Please try again.</p>
    </Container>
  );
};

export default Cancel;
