import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { removeToken } from "../utils/tokenUtils";
import { useAuth } from "../context/AuthContext";

const AdminNavbar = () => {
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
      removeToken();
      navigate("/");
      console.log("User Logged Out");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      {/* Main Navbar */}
      <Navbar className="custom-navbar-admin" fixed="top">
        <Container>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="mx-2">
              <span className="material-icons">home</span>
            </Nav.Link>
            <Nav.Link as={Link} to="/profile" className="mx-2">
              <span className="material-icons">account_circle</span>{" "}
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/manager" className="mx-2">
              <span className="material-symbols-outlined">tune</span>{" "}
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/report" className="mx-2">
              <span className="material-symbols-outlined">monitoring</span>{" "}
            </Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            <Nav.Link as="button" onClick={handleLogout} className="mx-2">
              <span className="material-icons">logout</span>
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      {/* Fixed Search Bar */}
      {/* <div className="search-bar-container">
        <Form className="d-flex w-100" onSubmit={handleSearchSubmit}>
          <FormControl
            type="search"
            name="search"
            placeholder="Search"
            className="search-input mx-auto"
            aria-label="Search"
          />
        </Form>
      </div> */}
    </>
  );
};

export default AdminNavbar;

//? ////////////////////////////////////////////////////////////////////

// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { Form, FormControl } from "react-bootstrap";
// import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
// import { removeToken } from "../utils/tokenUtils"; // Import token utility function
// import { useAuth } from "../context/AuthContext"; // Ensure useAuth is imported
// import "../styles/adminSidebar.css";

// const AdminNavbar = () => {
//   const { logout } = useAuth(); // Get logout from context
//   const navigate = useNavigate(); // Hook for navigation

//   const handleSearchSubmit = (event) => {
//     event.preventDefault(); // Prevent the default form submission
//     const query = event.target.search.value; // Get the value from the input field
//     if (query) {
//       navigate(`/search?q=${encodeURIComponent(query)}`); // Redirect to the search page with the query parameter
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       await logout(); // Call logout from context
//       removeToken(); // Remove token from local storage
//       navigate("/"); // Redirect to login page
//       console.log("User Logged Out");
//     } catch (error) {
//       console.error("Logout failed:", error);
//       // Optionally, add user feedback here
//     }
//   };

//   return (
//     <div className="sidebar-container">
//       {/* Sidebar */}
//       <div className="sidebar">
//         <h2 className="sidebar-title">Admin Panel</h2>
//         <nav className="sidebar-nav">
//           <Link to="/" className="sidebar-link">
//             Home
//           </Link>
//           <Link to="/report" className="sidebar-link">
//             Reports
//           </Link>
//           <Link to="/productmanagement" className="sidebar-link">
//             Manage Products
//           </Link>
//           <Link to="/shipment" className="sidebar-link">
//             Shipments
//           </Link>
//           <button onClick={handleLogout} className="sidebar-link logout-btn">
//             <span className="material-icons">logout</span>
//           </button>
//         </nav>
//       </div>

//       {/* <div className="main-content">
//         <div className="search-bar-container">
//           <Form className="d-flex w-100" onSubmit={handleSearchSubmit}>
//             <FormControl
//               type="search"
//               name="search"
//               placeholder="Search"
//               className="search-input mx-auto"
//               aria-label="Search"
//             />
//           </Form>
//         </div>
//       </div> */}
//     </div>
//   );
// };

// export default AdminNavbar;
