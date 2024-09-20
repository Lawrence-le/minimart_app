// frontend/src/pages/Cart.jsx

import React from "react";
import { Button, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();

  // Dummy data for cart items
  const cartItems = [
    { id: 1, name: "Product 1", quantity: 2, price: 10.0 },
    { id: 2, name: "Product 2", quantity: 1, price: 20.0 },
  ];

  // Calculate total price
  const totalPrice = cartItems
    .reduce((total, item) => total + item.price * item.quantity, 0)
    .toFixed(2);

  return (
    <div className="container mt-4">
      <h1>Shopping Cart</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>${item.price.toFixed(2)}</td>
              <td>${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="d-flex justify-content-between">
        <h4>Total: ${totalPrice}</h4>
        <Button variant="primary" onClick={() => navigate("/checkout")}>
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
};

export default Cart;
