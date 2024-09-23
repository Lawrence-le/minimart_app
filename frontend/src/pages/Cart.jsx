import { useEffect, useState } from "react";
import { Button, Row, Col, Card, Container, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import CartProductCard from "../components/CartProductCard";
import {
  getCartProducts,
  removeFromCart,
  updateCartQuantity,
  getCartTotal,
} from "../services/cartsService";
import "../styles/cartStyles.css";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCart, setTotalCart] = useState(0);
  const [totalOrder, setTotalOrder] = useState(0);
  const { shippingCost } = useCart();
  const navigate = useNavigate();

  const updateTotals = (totalAmount) => {
    setTotalCart(totalAmount.toFixed(2));
    setTotalOrder(
      (parseFloat(totalAmount) + parseFloat(shippingCost)).toFixed(2)
    );
  };

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const cartResponse = await getCartProducts();
        setCartItems(cartResponse);
        const totalAmount = await getCartTotal();
        updateTotals(totalAmount);
      } catch (error) {
        console.error("Failed to fetch cart data.", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, [shippingCost]);

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId);
      const updatedItems = cartItems.filter(
        (item) => item.product_id !== productId
      );
      setCartItems(updatedItems);
      // Re-fetch total after removal
      const totalAmount = await getCartTotal();
      updateTotals(totalAmount);
    } catch (error) {
      console.error("Failed to remove product from cart.", error);
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    try {
      await updateCartQuantity(productId, newQuantity);
      const updatedItems = cartItems.map((item) =>
        item.product_id === productId
          ? { ...item, quantity: newQuantity }
          : item
      );
      setCartItems(updatedItems);
      const totalAmount = await getCartTotal();
      updateTotals(totalAmount);
    } catch (error) {
      console.error("Failed to update product quantity in cart.", error);
    }
  };

  const handleProceedToCheckout = () => {
    navigate("/checkout");
  };

  const handleContinueShopping = () => {
    navigate("/store");
  };

  if (loading) {
    return (
      <Container className="cart-container mt-4">
        <Row className="justify-content-center mb-2">
          <Col md={10}>
            <h4>Your Cart</h4>
          </Col>
        </Row>
        <div className="text-center mt-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </Container>
    );
  }

  console.log("total order: ", totalOrder);

  return (
    <Container className="cart-container mt-4">
      <Row className="justify-content-center mb-2">
        <Col md={10}>
          <h4>Your Cart</h4>
        </Col>
      </Row>

      {cartItems === undefined ? (
        <div className="text-center">
          <p>Your cart is empty</p>
          <Button
            variant="info"
            className="button_custom mt-3"
            onClick={handleContinueShopping}
          >
            Continue Shopping
          </Button>
        </div>
      ) : (
        <Row className="justify-content-center">
          <Col md={6} className="mb-3">
            {cartItems.map((item) => (
              <CartProductCard
                key={item.product_id}
                product={item}
                onRemove={handleRemove}
                onUpdate={handleUpdateQuantity}
              />
            ))}
          </Col>
          <Col md={4}>
            <Card className="mb-3">
              <Card.Body>
                <h5 className="text-center">Order Summary</h5>
                <hr />
                <div className="d-flex justify-content-between">
                  <span>Total Item Price:</span>
                  <span>${totalCart}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Shipping:</span>
                  <span>${shippingCost}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <p>
                    <strong>Total:</strong>
                  </p>
                  <p>
                    <strong>${totalOrder}</strong>
                  </p>
                </div>
                <Button
                  variant="info"
                  className="button_custom mt-3"
                  onClick={handleProceedToCheckout}
                >
                  Proceed to Checkout
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Cart;
