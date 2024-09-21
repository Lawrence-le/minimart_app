import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { Container, Row, Col, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/globalStyles.css";
import { getCategory } from "../services/categoriesService";
import { filterProductsByCategory } from "../services/productsService";

const Home = () => {
  // State to hold products and titles
  const [category1Products, setcategory1Products] = useState([]);
  const [category2Products, setcategory2Products] = useState([]);
  const [category3Products, setcategory3Products] = useState([]);
  const [category1Title, setcategory1Title] = useState("Loading...");
  const [category2Title, setcategory2Title] = useState("Loading...");
  const [category3Title, setcategory3] = useState("Loading...");

  // Default category IDs
  const category1CategoryId = "1";
  const category2CategoryId = "2";
  const category3CategoryId = "10";

  // Fetch category titles and products on component mount
  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        // Fetch category1 category data
        const category1CategoryArray = await getCategory(category1CategoryId);
        // console.log("category1 category data:", category1CategoryArray);

        // Check if the data is an array and access the first item
        const category1Category = Array.isArray(category1CategoryArray)
          ? category1CategoryArray[0]
          : category1CategoryArray;
        setcategory1Title(category1Category?.name || "No Title");

        // Fetch products for category1 category
        const category1ProductsData = await filterProductsByCategory(
          category1CategoryId
        );
        setcategory1Products(category1ProductsData.products || []);

        // Fetch category2 category data
        const category2CategoryArray = await getCategory(category2CategoryId);
        // console.log("Ready to Eat category data:", category2CategoryArray);
        const category2Category = Array.isArray(category2CategoryArray)
          ? category2CategoryArray[0]
          : category2CategoryArray;
        setcategory2Title(category2Category?.name || "No Title");
        const category2ProductsData = await filterProductsByCategory(
          category2CategoryId
        );
        setcategory2Products(category2ProductsData.products || []);

        // Fetch category3 category data
        const category3CategoryArray = await getCategory(category3CategoryId);
        // console.log("category3 category data:", category3CategoryArray);
        const category3Category = Array.isArray(category3CategoryArray)
          ? category3CategoryArray[0]
          : category3CategoryArray;
        setcategory3(category3Category?.name || "No Title");
        const category3ProductsData = await filterProductsByCategory(
          category3CategoryId
        );
        setcategory3Products(category3ProductsData.products || []);
      } catch (error) {
        console.error("Error fetching category or products:", error.message);
      }
    };

    fetchCategoryData();
  }, [category1CategoryId, category2CategoryId, category3CategoryId]);

  const renderProductSection = (title, products) => (
    <section className="text-center category-section mb-4">
      <h4 className="mb-3 text-start fw-bold">{title}</h4>
      {/* Bold and right-aligned title */}
      <Row className="justify-content-md-left">
        {Array.isArray(products) && products.length === 0 ? (
          <p>No products available in this category.</p>
        ) : (
          products.map((product) => (
            <Col
              key={product.id}
              xs={6}
              sm={6}
              md={4}
              lg={3}
              xl={2}
              className="mb-2"
            >
              <ProductCard product={product} />
            </Col>
          ))
        )}
      </Row>
      <Link to="/store">
        <Button variant="primary" className="button_custom mt-4">
          View More Products
        </Button>
      </Link>
    </section>
  );

  return (
    <Container>
      <header className="text-center mb-4" style={{ marginTop: "10rem" }}>
        {/* <h1>Welcome to My Page</h1> */}
        <h3 style={{ color: "#2471a3 " }}>
          Your Friendly Neighbourhood Minimart
        </h3>
      </header>

      {renderProductSection(category1Title, category1Products)}
      {renderProductSection(category2Title, category2Products)}
      {renderProductSection(category3Title, category3Products)}
    </Container>
  );
};

export default Home;
