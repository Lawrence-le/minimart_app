//frontend\src\pages\AdminPanel.jsx
import { useState } from "react";
import { Container, Row, Col, Nav } from "react-bootstrap";

import CategoryManager from "../components/CategoryManager";
import ProductManager from "../components/ProductManager";
import OrderManager from "../components/OrderManager";

const AdminPanel = () => {
  const [activeComponent, setActiveComponent] = useState("productmanager");

  return (
    <Container className="container-admin px-3">
      <Row>
        <Col md={2} xs={12}>
          <h5 className="mb-3">Admin Manager</h5>

          <Nav className="flex-column">
            <Nav.Link
              href="#"
              onClick={() => setActiveComponent("productmanager")}
            >
              Inventory
            </Nav.Link>

            <Nav.Link
              href="#"
              onClick={() => setActiveComponent("categorymanager")}
            >
              Categories
            </Nav.Link>

            <Nav.Link
              href="#"
              onClick={() => setActiveComponent("ordermanager")}
            >
              Orders
            </Nav.Link>
          </Nav>
        </Col>

        <Col md={10} xs={12}>
          {activeComponent === "categorymanager" && <CategoryManager />}
          {activeComponent === "productmanager" && <ProductManager />}
          {activeComponent === "ordermanager" && <OrderManager />}
        </Col>
      </Row>
    </Container>
  );
};

export default AdminPanel;
