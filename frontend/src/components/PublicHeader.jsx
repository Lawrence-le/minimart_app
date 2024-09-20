import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Form, FormControl } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
// import "./header.css"; // Ensure you import your custom CSS

const PublicHeader = () => {
  return (
    <>
      {/* Fixed No Shipping Banner */}
      <div className="no-shipping-banner custom-navbar px-5 fixed=top">
        <span>No Free Shipping</span>
      </div>
    </>
  );
};

export default PublicHeader;
