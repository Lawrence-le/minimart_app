import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { addToCart } from "../services/cartsService";
import { useAuth } from "../context/AuthContext";
import LoginModal from "./LoginModal";

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const handleAddToCart = async (product, quantity) => {
    if (!user) {
      console.log("User is null. Showing login modal.");
      setShowModal(true); // Only set the state to show the modal
      return;
    }

    try {
      const response = await addToCart(product.id, quantity);
      console.log(`${product.name} added to cart successfully!`);
      console.log("Response:", response);
    } catch (error) {
      console.error(`Failed to add ${product.name} to cart.`, error);
    }
  };

  const toggleModal = () => {
    setShowModal(!showModal); // Toggle modal visibility
  };

  return (
    <>
      <Card className="product-card">
        <Link to={`/product/${product.id}`}>
          <Card.Img
            variant="top"
            src={product.image_url}
            alt={product.name}
            className="product-image"
          />
        </Link>
        <Card.Body
          className="text-start"
          style={{ backgroundColor: "#f8f9fa" }}
        >
          <div className="text-start product-name">{product.name}</div>
          <div className="price_text">
            <strong>${product.price}</strong>
          </div>

          <div className="d-flex justify-content-center">
            <Button
              className="d-flex align-items-center justify-content-center button_custom mt-3"
              size="sm"
              onClick={() => handleAddToCart(product, 1)}
            >
              Add to cart
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Login Modal */}
      <LoginModal show={showModal} toggleModal={toggleModal} />
    </>
  );
};

export default ProductCard;
