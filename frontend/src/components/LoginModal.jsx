import { useState } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { registerUser, loginUser } from "../services/userService";
import { setToken } from "../utils/tokenUtils";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginModal = ({ show, toggleModal }) => {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    try {
      const { access_token } = await loginUser(username, password);
      setToken(access_token);
      login(access_token);
      toggleModal(); // Close the modal after successful login
      navigate("/");
    } catch (error) {
      setError("Login failed. Please try again.");
    }
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    try {
      await registerUser(username, email, password, first_name, last_name);
      setIsLogin(true); // Switch to login form after registration
    } catch (error) {
      setError("Registration failed. Please try again.");
    }
  };

  const switchForm = () => {
    setIsLogin(!isLogin);
    setError(""); // Clear errors when switching forms
  };

  return (
    <Modal show={show} onHide={toggleModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>{isLogin ? "Sign in" : "Register"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <div className="mb-4">{error}</div>}
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

          <Button type="submit" className="button_custom mt-3 w-100">
            {isLogin ? "Login" : "Register"}
          </Button>

          <Button
            variant="secondary"
            onClick={switchForm}
            className="mt-3 w-100"
          >
            {isLogin ? "Register here" : "Login here"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;
