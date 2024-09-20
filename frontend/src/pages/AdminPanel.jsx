//frontend\src\pages\AdminPanel.jsx
import { useState } from "react";
import "../styles/adminSidebar.css";
import { Container, Row, Col, Nav } from "react-bootstrap";

import CategoryManager from "../components/CategoryManager";
import ProductManager from "../components/ProductManager";

const AdminPanel = () => {
  const [activeComponent, setActiveComponent] = useState("productmanager");

  return (
    <Container fluid className="container-admin">
      <Row>
        <Col md={2} xs={12} className="mx-2">
          <h5>Admin Manager</h5>
          <div>Products</div>
          <Nav className="flex-column">
            <Nav.Link
              className="mb-2"
              href="#"
              active={activeComponent === "productmanager"}
              onClick={() => setActiveComponent("productmanager")}
            >
              Add/Edit/Delete
            </Nav.Link>

            <div>Categories</div>
            <Nav.Link
              href="#"
              active={activeComponent === "categorymanager"}
              onClick={() => setActiveComponent("categorymanager")}
            >
              Add/Edit/Delete
            </Nav.Link>
          </Nav>
        </Col>

        <Col md={9} xs={12}>
          {activeComponent === "categorymanager" && <CategoryManager />}
          {activeComponent === "productmanager" && <ProductManager />}
        </Col>
      </Row>
    </Container>
  );
};

export default AdminPanel;
