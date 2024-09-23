import { Card, Container, Row, Col } from "react-bootstrap";

const Report = () => {
  return (
    <Container className="container" style={{ marginTop: "10rem" }}>
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Header as="h4" className="text-center">
              Analysis
            </Card.Header>
            <Card.Body>
              <Card.Text>
                <strong>Coming Soon...</strong>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Report;
