// frontend\src\components\UserNavbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../context/AuthContext";
import SearchNavBar from "../components/SearchNavbar";
import { getUserProtectedData } from "../services/userService";
import { useEffect, useState } from "react";

const UserNavbar = () => {
  const { logout, user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [firstName, setFirstName] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUserProtectedData();
        setUserData(data);
        // console.log("USER DATA: ", data);
        // console.log("FirstName: ", data.user_data.first_name);
        setFirstName(data.user_data.first_name);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to fetch user data");
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      // removeToken(); // Remove token from local storage
      navigate("/");
      console.log("User Logged Out");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      <Navbar className="custom-navbar" fixed="top">
        <Container>
          <Nav className="me-auto">
            <Nav.Link
              as={Link}
              to="/"
              className="mx-2 "
              style={{ color: "white" }}
            >
              <span className="material-icons">home</span>
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/store"
              className="mx-2"
              style={{ color: "white" }}
            >
              <span className="material-icons">store</span>
            </Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            <Nav.Link
              as={Link}
              to="/orders"
              className="mx-2"
              style={{ color: "white" }}
            >
              <span className="material-icons">view_list</span>
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/cart"
              className="mx-2"
              style={{ color: "white" }}
            >
              <span className="material-symbols-outlined">shopping_cart</span>
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/profile"
              className="mx-2"
              style={{ color: "white" }}
            >
              <span className="material-icons">account_circle</span>
            </Nav.Link>
            <Nav.Link
              as="button"
              onClick={handleLogout}
              className="mx-2"
              style={{ color: "white" }}
            >
              <span className="material-icons">logout</span>
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <SearchNavBar username={firstName} />
    </>
  );
};

export default UserNavbar;
