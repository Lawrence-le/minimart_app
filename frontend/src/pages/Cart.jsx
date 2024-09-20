// frontend\src\pages\Cart.jsx
import { useEffect, useState } from "react";
import { Button, Row, Col, Card, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import CartProductCard from "../components/CartProductCard";
import { getCartItems } from "../services/cartsService";
import { getProducts } from "../services/productsService";
import "../styles/cartStyles.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [shippingCost] = useState(5.0); // Example shipping cost
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await getCartItems();
        const items = response.cart_items;
        console.log("Cart items fetched: ", items);
        setCartItems(items);

        const productResponse = await getProducts();
        const allProducts = productResponse.products;
        console.log("Fetched products: ", allProducts);
        setProducts(allProducts);
      } catch (error) {
        console.error("Failed to fetch cart items.", error);
        setCartItems([]);
      }
    };

    fetchCartItems();
  }, []);

  // Calculate total price
  const totalPrice = cartItems
    .reduce((total, item) => {
      const product = products.find((prod) => prod.id === item.product_id);
      return product ? total + product.price * item.quantity : total;
    }, 0)
    .toFixed(2);

  // Update the total state whenever cartItems or shippingCost changes
  useEffect(() => {
    setTotal((parseFloat(totalPrice) + shippingCost).toFixed(2));
  }, [totalPrice, shippingCost]);

  const handleRemoveFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleUpdateCartItem = (id, quantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const handleProceedToCheckout = () => {
    navigate("/checkout", { state: { total, shippingCost } });
  };

  return (
    <Container className="cart-container mt-4">
      <h3 className="mb-3">Your Cart</h3>
      <Row>
        <Col md={8}>
          {cartItems.map((item) => {
            const product = products.find(
              (prod) => prod.id === item.product_id
            );
            console.log("Cart Item: ", item, "Product: ", product);

            return (
              product && (
                <CartProductCard
                  key={item.id}
                  product={{ ...product, quantity: item.quantity }}
                  onRemove={handleRemoveFromCart}
                  onUpdate={handleUpdateCartItem}
                />
              )
            );
          })}
        </Col>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <h4>Order Summary</h4>
              <hr />
              <div className="d-flex justify-content-between">
                <span>Total Item Price:</span>
                <span>${totalPrice}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Shipping:</span>
                <span>${shippingCost.toFixed(2)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <h5>Total:</h5>
                <h5>${total}</h5>
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
    </Container>
  );
};

export default Cart;
