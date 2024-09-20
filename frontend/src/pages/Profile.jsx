import { useState, useEffect } from "react";
import {
  Button,
  Card,
  Container,
  Row,
  Col,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { getUserProtectedData } from "../services/userService";
import { format } from "date-fns";

const Profile = () => {
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { user_data } = await getUserProtectedData();
        const [id, username, email, firstName, lastName, isAdmin, createdAt] =
          user_data;
        setUserData({
          first_name: firstName,
          last_name: lastName,
          email,
          created_at: createdAt,
        });
      } catch (error) {
        setError("Failed to fetch user data. " + (error.message || ""));
      } finally {
        setLoading(false); // Ensure loading is set to false after data fetch attempt
      }
    };

    fetchUserData();
  }, [user]);

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="container">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="container">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Header as="h4" className="bg-primary text-white text-center">
              Your Profile
            </Card.Header>
            <Card.Body>
              <Card.Text>
                <strong>Name:</strong> {userData.first_name}{" "}
                {userData.last_name}
              </Card.Text>
              <Card.Text>
                <strong>Email Address:</strong> {userData.email}
              </Card.Text>
              <Card.Text>
                <strong>Account Created:</strong>{" "}
                {format(new Date(userData.created_at), "dd MMM yyyy")}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
