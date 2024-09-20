// frontend\src\components\PublicNavbar.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Navbar,
  Nav,
  Form,
  FormControl,
  Modal,
  Button,
  InputGroup,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { registerUser, loginUser } from "../services/userService";
import { setToken } from "../utils/tokenUtils";
import { useAuth } from "../context/AuthContext";
import { getUserProtectedData } from "../services/userService";
import { createEmptyCart } from "../services/cartsService";

const PublicNavbar = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  // State for form inputs
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [error, setError] = useState("");

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const query = event.target.search.value;
    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const toggleModal = () => {
    setShowModal(!showModal);
    setError("");
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    try {
      const { access_token } = await loginUser(username, password);
      console.log("Server response:", access_token);
      login(access_token);
      console.log("Login successful! Token:", access_token);

      setShowModal(false);
      navigate("/profile");
    } catch (error) {
      setError("Login failed. Please try again.");
    }
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    console.log({ username, email, password, first_name, last_name });
    try {
      const userResponse = await registerUser(
        username,
        email,
        password,
        first_name,
        last_name
      );
      console.log("See filled in details on sign up: ", userResponse);
      const userId = userResponse[0];
      console.log("User Id of sign up user: ", userId);

      await createEmptyCart(userId);

      setIsLogin(true);
    } catch (error) {
      setError("Registration failed. Please try again.");
    }
  };

  const switchForm = () => {
    setIsLogin(!isLogin);
    setError("");
  };

  return (
    <>
      {/* Main Navbar */}
      <Navbar className="custom-navbar px-5" fixed="top">
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/store" className="mx-2">
            Store
          </Nav.Link>
        </Nav>
        <Nav className="ms-auto">
          <Nav.Link className="mx-2" onClick={toggleModal}>
            <span className="material-icons">login</span> Login/Register
          </Nav.Link>
        </Nav>
      </Navbar>

      {/* Fixed Search Bar */}
      <div className="search-bar-container">
        <Form className="d-flex w-100" onSubmit={handleSearchSubmit}>
          <FormControl
            type="search"
            name="search"
            placeholder="Search"
            className="search-input mx-auto"
            aria-label="Search"
          />
        </Form>
      </div>

      {/* Modal for Login/Register */}
      <Modal
        show={showModal}
        onHide={toggleModal}
        centered
        className="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>{isLogin ? "Sign in" : "Register"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <div className="mb-4">{error}</div>}{" "}
          <Form onSubmit={isLogin ? handleLoginSubmit : handleRegisterSubmit}>
            <InputGroup className="mb-3">
              <InputGroup.Text id="username-icon">
                <span className="material-icons">person</span>
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                aria-label="Username"
                aria-describedby="username-icon"
              />
            </InputGroup>

            {/* Email input only for registration */}
            {!isLogin && (
              <>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="first-name-icon">
                    <span className="material-icons">edit_note</span>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Enter first name"
                    value={first_name}
                    onChange={(e) => setFirstName(e.target.value)}
                    aria-label="First Name"
                    aria-describedby="first-name-icon"
                  />
                </InputGroup>

                <InputGroup className="mb-3">
                  <InputGroup.Text id="last-name-icon">
                    <span className="material-icons">edit_note</span>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Enter last name"
                    value={last_name}
                    onChange={(e) => setLastName(e.target.value)}
                    aria-label="Last Name"
                    aria-describedby="last-name-icon"
                  />
                </InputGroup>

                <InputGroup className="mb-3">
                  <InputGroup.Text id="email-icon">
                    <span className="material-icons">email</span>
                  </InputGroup.Text>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-label="Email"
                    aria-describedby="email-icon"
                  />
                </InputGroup>
              </>
            )}

            <InputGroup className="mb-3">
              <InputGroup.Text id="password-icon">
                <span className="material-icons">lock</span>
              </InputGroup.Text>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-label="Password"
                aria-describedby="password-icon"
              />
            </InputGroup>

            <Button
              variant="primary"
              type="submit"
              className="mt-3 w-100 button_custom"
              style={{ borderRadius: "0" }}
            >
              {isLogin ? "Login" : "Register"}
            </Button>

            <Button
              variant="secondary"
              type="button"
              onClick={switchForm}
              className="mt-3 w-100"
              style={{ borderRadius: "0" }}
            >
              {isLogin ? "Register here" : "Login here"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PublicNavbar;
