// frontend\src\components\ProductCard.jsx

import { Link } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { addToCart } from "../services/cartsService";

const ProductCard = ({ product }) => {
  const handleAddToCart = async (product, quantity) => {
    try {
      const response = await addToCart(product.id, quantity);
      console.log(`${product.name} added to cart successfully!`);
      console.log("Response:", response);
    } catch (error) {
      console.error(`Failed to add ${product.name} to cart.`, error);
    }
  };

  return (
    <Card className="product-card">
      <Link to={`/product/${product.id}`}>
        <Card.Img
          variant="top"
          src={product.image_url}
          alt={product.name}
          className="product-image"
        />
      </Link>
      <Card.Body className="text-start" style={{ backgroundColor: "#f8f9fa" }}>
        <Card.Text className="text-start product-name">
          {product.name}
        </Card.Text>
        <Card.Title style={{ color: "#d81b60" }}>
          <strong>${product.price}</strong>
        </Card.Title>

        <div className="d-flex justify-content-center">
          <Button
            className="d-flex align-items-center justify-content-center button_custom mt-3"
            onClick={() => handleAddToCart(product, 1)}
          >
            Add to cart
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
