import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Form, FormControl } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { removeToken } from "../utils/tokenUtils";
import { useAuth } from "../context/AuthContext";

const UserNavbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const query = event.target.search.value;
    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

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
      <Navbar className="custom-navbar px-5" fixed="top">
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
    </>
  );
};

export default UserNavbar;
