// frontend/src/components/PublicNavbar.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import LoginModal from "./LoginModal";
import SearchNavBar from "./SearchNavbar";
import LogoSection from "./LogoSection";

const PublicNavbar = () => {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <>
      <Navbar className="custom-navbar" fixed="top">
        <Container>
          <Nav className="me-auto">
            <Nav.Link
              as={Link}
              to="/"
              className="mx-2"
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
              className="mx-2"
              style={{ color: "white" }}
              onClick={toggleModal}
            >
              <span className="material-icons">login</span> Login/Register
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <SearchNavBar />
      <LoginModal show={showModal} toggleModal={toggleModal} />
    </>
  );
};

export default PublicNavbar;
