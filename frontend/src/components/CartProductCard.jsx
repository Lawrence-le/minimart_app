import { Card, Button, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const CartProductCard = ({ product, onRemove, onUpdate, isCheckout }) => {
  const handleRemove = async () => {
    await onRemove(product.product_id);
  };

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return;
    await onUpdate(product.product_id, newQuantity);
  };

  return (
    <Card className="cart-product-card mb-2">
      <Row>
        <Col md={2}>
          <Card.Img
            className="ms-2 mt-3"
            variant="top"
            src={product.image_url}
            alt={product.name}
          />
        </Col>
        <Col md={8} className="ms-2">
          <Card.Body>
            <Card.Text className="mb-3">{product.name}</Card.Text>
            <Card.Title style={{ color: "#d81b60" }}>
              <strong>${product.price}</strong>
            </Card.Title>
            {!isCheckout && (
              <Card.Text>
                Quantity:
                <input
                  type="number"
                  min="1"
                  value={product.quantity}
                  onChange={(e) =>
                    handleQuantityChange(parseInt(e.target.value))
                  }
                  style={{ width: "60px", marginLeft: "5px" }}
                />
                <Button variant="link" className="ms-4" onClick={handleRemove}>
                  Remove
                </Button>
              </Card.Text>
            )}
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
};

export default CartProductCard;
