import { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import {
  getProducts,
  filterProductsByCategory,
} from "../services/productsService";
import { getCategories } from "../services/categoriesService";
import ProductCard from "../components/ProductCard";

const Store = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [products, setProducts] = useState([]);

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const productsData = await getProducts();
      // console.log("productsData: ", productsData);
      setProducts(productsData.products || []);
    } catch (error) {
      console.error("Failed to fetch products", error);
      setProducts([]);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const fetchedCategories = await getCategories();
      // console.log("fetchedCategories:", fetchedCategories);
      setCategories(fetchedCategories);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  // Fetch products by selected category
  const fetchProductsByCategory = async (categoryId) => {
    if (categoryId) {
      try {
        const filteredProducts = await filterProductsByCategory(categoryId);
        // console.log("filteredProducts: ", filteredProducts);
        setProducts(filteredProducts.products);
      } catch (error) {
        console.error("Error fetching products by category:", error);
        setProducts([]);
      }
    } else {
      fetchProducts();
    }
  };

  // Handle category change
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    fetchProductsByCategory(categoryId);
  };

  // Clear filter
  const clearFilter = () => {
    setSelectedCategory("");
    fetchProducts();
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  return (
    <Container style={{ marginTop: "10rem" }}>
      <Row className="justify-content-center mb-2">
        <Col md={10}>
          <h4>Store</h4>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={2}>
          <p className="mb-3">Filter by Category</p>
          <Form>
            {categories.map((category) => (
              <Form.Check
                key={category.id}
                type="checkbox"
                id={`category-${category.id}`}
                label={category.name}
                value={category.id}
                checked={selectedCategory === category.id}
                onChange={() => handleCategoryChange(category.id)} // i try this to enable tick box showing up with line 55
              />
            ))}
          </Form>
          <Button
            variant="secondary"
            size="sm"
            onClick={clearFilter}
            className="mt-3"
          >
            Clear Filter
          </Button>
        </Col>
        <Col md={8}>
          <Row>
            {Array.isArray(products) && products.length === 0 ? (
              <p>No products found for the selected category.</p>
            ) : (
              products.map((product) => (
                <Col
                  key={product.id}
                  xs={6}
                  sm={6}
                  md={4}
                  lg={3}
                  className="mb-2"
                >
                  <ProductCard product={product} />
                </Col>
              ))
            )}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Store;

// checked={selectedCategory.includes(category.id)}
