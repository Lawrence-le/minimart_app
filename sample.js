import { useState, useEffect } from "react";
import {
  Button,
  Card,
  Container,
  Row,
  Col,
  Spinner,
  Alert,
  Form,
  ListGroup,
} from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { getUserProtectedData } from "../services/userService";
import { format } from "date-fns";
import {
  getAddresses,
  addAddress,
  deleteAddress,
} from "../services/addressesService";

const Profile = () => {
  const { user, login } = useAuth();
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addresses, setAddresses] = useState([]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [postalCode, setPostalCode] = useState("");

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const addressList = await getAddresses();
        setAddresses(addressList);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { user_data } = await getUserProtectedData();
        setUserData({
          first_name: user_data.first_name,
          last_name: user_data.last_name,
          email: user_data.email,
          created_at: user_data.created_at,
        });
      } catch (error) {
        setError("Failed to fetch user data. " + (error.message || ""));
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const clearForm = () => {
    setFirstName("");
    setLastName("");
    setAddressLine1("");
    setAddressLine2("");
    setPostalCode("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const addressData = {
      first_name: firstName,
      last_name: lastName,
      address_line1: addressLine1,
      address_line2: addressLine2,
      postal_code: postalCode,
    };

    try {
      await addAddress(addressData);
      setAddresses((prevAddresses) => [
        ...prevAddresses,
        { ...addressData, id: Date.now() },
      ]);
      clearForm();
    } catch (error) {
      console.error("Error submitting address:", error);
    }
  };

  const handleDelete = async (addressId) => {
    try {
      await deleteAddress(addressId);
      setAddresses((prevAddresses) =>
        prevAddresses.filter((address) => address.id !== addressId)
      );
    } catch (error) {
      console.error("Error deleting address:", error);
      setError("Failed to delete address. " + (error.message || ""));
    }
  };

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
    <Container className="container" style={{ marginTop: "10rem" }}>
      <Row className="justify-content-center mb-2">
        <Col md={8}>
          <h4>Profile</h4>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={4}>
          <Card className="shadow-sm mb-3">
            <Card.Header>Your Profile</Card.Header>
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
                {userData.created_at &&
                  format(
                    new Date(Date.parse(userData.created_at)),
                    "dd MMM yyyy"
                  )}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3">
            <Card.Header>Your Addresses</Card.Header>
            <Card.Body>
              <ListGroup>
                {addresses.length === 0 ? (
                  <ListGroup.Item className="text-center">
                    <strong>No addresses found. Please add an address.</strong>
                  </ListGroup.Item>
                ) : (
                  addresses.map((address) => (
                    <ListGroup.Item
                      key={address.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        flexDirection: "column",
                      }}
                    >
                      <Row>
                        <Col md={10}>
                          <div>
                            <strong>{`${address.first_name} ${address.last_name}`}</strong>
                          </div>
                          <div>{address.address_line1}</div>
                          {address.address_line2 && (
                            <div>{address.address_line2}</div>
                          )}
                          <div>{address.postal_code}</div>
                        </Col>
                        <Col md={2}>
                          <Button
                            variant="link"
                            onClick={() => handleDelete(address.id)}
                            style={{ marginRight: "5rem" }}
                          >
                            <span
                              className="material-icons"
                              style={{ color: "#cd6155 " }}
                            >
                              delete
                            </span>
                          </Button>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))
                )}
              </ListGroup>
            </Card.Body>
          </Card>
          <Card className="mb-5">
            <Card.Header>Add New Address</Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formFirstName">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="mb-2"
                  />
                </Form.Group>
                <Form.Group controlId="formLastName">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="mb-2"
                  />
                </Form.Group>
                <Form.Group controlId="formAddressLine1">
                  <Form.Label>Address Line 1</Form.Label>
                  <Form.Control
                    type="text"
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    required
                    className="mb-2"
                  />
                </Form.Group>
                <Form.Group controlId="formAddressLine2">
                  <Form.Label>Address Line 2</Form.Label>
                  <Form.Control
                    type="text"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    className="mb-2"
                  />
                </Form.Group>
                <Form.Group controlId="formPostalCode">
                  <Form.Label>Postal Code</Form.Label>
                  <Form.Control
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    required
                    className="mb-2"
                  />
                </Form.Group>
                <Button
                  className="button_custom mt-3"
                  variant="primary"
                  type="submit"
                >
                  Add Address
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
