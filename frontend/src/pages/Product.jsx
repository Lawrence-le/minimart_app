import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../services/productsService";
import { addToCart } from "../services/cartsService";
import { Container, Row, Col, Button } from "react-bootstrap";

const Product = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");

  // Fetch the product details
  const fetchProductDetails = async () => {
    try {
      const productData = await getProductById(productId);
      console.log("productData: ", productData);
      setProduct(productData.product);
    } catch (error) {
      console.error("Error fetching product details:", error);
      setError("Failed to load product details.");
    }
  };

  // Handle adding to cart
  const handleAddToCart = async () => {
    try {
      await addToCart(productId, 1);
      alert("Product added to cart");
    } catch (error) {
      console.error("Error adding product to cart:", error);
      setError("Failed to add product to cart.");
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <Container className="container" style={{ marginTop: "12rem" }}>
      <Row className="justify-content-center">
        <Col md={3}>
          <img
            src={product.image_url}
            alt={product.name}
            className="img-fluid"
          />
        </Col>
        <Col md={5}>
          <h3 className="mb-3 mt-4">{product.name}</h3>
          <h4 className="mb-5" style={{ fontWeight: "300" }}>
            {product.description}
          </h4>
          <h2 className="mb-4" style={{ color: "#d81b60" }}>
            ${product.price}
          </h2>
          <Button className="button_custom" onClick={handleAddToCart}>
            Add to Cart
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Product;
