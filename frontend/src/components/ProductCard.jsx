import { Link } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const ProductCard = ({ product }) => {
  return (
    <Card className="product-card">
      <Link to={`/product/${product.id}`}>
        <Card.Img
          variant="top"
          src={product.image_url}
          alt={product.name}
          className="product-image"
          // className="d-block w-100"
        />
      </Link>
      <Card.Body className="text-start">
        <Card.Text className="text-start">{product.name}</Card.Text>
        <Card.Text className="text-start">${product.price}</Card.Text>

        <div className="d-flex justify-content-center">
          <Button
            className="d-flex align-items-center justify-content-center button_custom"
            onClick={() => handleAddToCart(product)}
          >
            Add to Cart
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

const handleAddToCart = (product) => {
  // Implement cart functionality here
  console.log(`${product.name} added to cart`);
};

export default ProductCard;
