import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { searchProducts } from "../services/productsService";
import ProductCard from "../components/ProductCard";
import { Container, Col, Row } from "react-bootstrap";

const SearchResult = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const searchQuery = new URLSearchParams(location.search).get("q");

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        const data = await searchProducts(searchQuery);
        setProducts(data.products);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchQuery]);

  if (loading) return <div>Loading...</div>;

  if (error) return <div>Error: {error}</div>;

  if (!products.length)
    return <div>No products found for "{searchQuery || "all"}".</div>;

  return (
    <Container style={{ marginTop: "10rem" }}>
      <h4>Search Results for "{searchQuery || "all"}"</h4>
      <Row>
        {products.map((product) => (
          <Col
            key={product.id}
            xs={6}
            sm={6}
            md={4}
            lg={3}
            xl={2}
            className="mb-3"
          >
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default SearchResult;
