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
        <Col md={3} className="d-flex justify-content-center">
          <Card.Img
            className="ms-2 mt-3"
            src={product.image_url}
            alt={product.name}
          />
        </Col>
        <Col md={8}>
          <Card.Body>
            <div>{product.name}</div>
            <div className="price_text_cart">
              <strong>${product.price}</strong>
            </div>
            <div>
              Qty:
              {isCheckout ? (
                <span> {product.quantity}</span>
              ) : (
                <input
                  type="number"
                  min="1"
                  value={product.quantity}
                  onChange={(e) =>
                    handleQuantityChange(parseInt(e.target.value))
                  }
                  style={{ width: "60px", marginLeft: "10px" }}
                />
              )}
              {!isCheckout && (
                <Button
                  variant="link"
                  className="ms-4"
                  size="sm"
                  onClick={handleRemove}
                >
                  Remove
                </Button>
              )}
            </div>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
};

export default CartProductCard;
