import { Card, Button, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { removeFromCart, updateCartQuantity } from "../services/cartsService"; // Import necessary functions

const CartProductCard = ({ product, onRemove, onUpdate }) => {
  const handleRemove = async () => {
    try {
      await removeFromCart(product.id);
      onRemove(product.id); // Callback to parent component to remove from state
    } catch (error) {
      console.error("Failed to remove product from cart.", error);
    }
  };

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return; // Prevent setting quantity to less than 1
    try {
      await updateCartQuantity(product.id, newQuantity);
      onUpdate(product.id, newQuantity); // Callback to update the state in parent
    } catch (error) {
      console.error("Failed to update product quantity in cart.", error);
    }
  };

  return (
    <Card className="cart-product-card mb-2">
      <Row>
        <Col md={3}>
          <Card.Img
            className="ms-3"
            variant="top"
            src={product.image_url}
            alt={product.name}
          />
        </Col>
        <Col md={9} className="d-flex flex-column justify-content-between">
          <Card.Body className="d-flex flex-column">
            <div>
              <Card.Text className="mb-3">{product.name}</Card.Text>
              <Card.Title>
                <strong>${product.price}</strong>
              </Card.Title>
            </div>
            <Card.Text className="d-flex align-items-center">
              Quantity:
              <input
                type="number"
                min="1"
                value={product.quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                style={{ width: "60px", marginLeft: "5px" }}
              />
              <Button variant="link" className="ms-4" onClick={handleRemove}>
                Remove
              </Button>
            </Card.Text>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
};

export default CartProductCard;
