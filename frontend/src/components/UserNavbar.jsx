// frontend\src\components\UserNavbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../context/AuthContext";
import SearchNavBar from "../components/SearchNavbar";

const UserNavbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

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
      {/* Main Navbar */}
      <Navbar className="custom-navbar" fixed="top">
        <Container>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="mx-2">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/store" className="mx-2">
              Store
            </Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/cart" className="mx-2">
              <span className="material-icons">shopping_cart</span>
            </Nav.Link>
            <Nav.Link as={Link} to="/profile" className="mx-2">
              <span className="material-icons">person</span>
            </Nav.Link>
            <Nav.Link as="button" onClick={handleLogout} className="mx-2">
              <span className="material-icons">logout</span>
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <SearchNavBar />
    </>
  );
};

export default UserNavbar;
