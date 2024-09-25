import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { Container, Row, Col, Button, Pagination } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/globalStyles.css";
import { getCategory } from "../services/categoriesService";
import { filterProductsByCategory } from "../services/productsService";

const Home = () => {
  // State to hold products and titles
  const [category1Products, setCategory1Products] = useState([]);
  const [category2Products, setCategory2Products] = useState([]);
  const [category3Products, setCategory3Products] = useState([]);
  const [category1Title, setCategory1Title] = useState("Loading...");
  const [category2Title, setCategory2Title] = useState("Loading...");
  const [category3Title, setCategory3Title] = useState("Loading...");

  // Pagination states
  const [category1Page, setCategory1Page] = useState(1);
  const [category2Page, setCategory2Page] = useState(1);
  const [category3Page, setCategory3Page] = useState(1);

  const itemsPerPage = 6;

  const category1CategoryId = "11";
  const category2CategoryId = "2";
  const category3CategoryId = "12";

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const category1CategoryArray = await getCategory(category1CategoryId);
        const category1Category = Array.isArray(category1CategoryArray)
          ? category1CategoryArray[0]
          : category1CategoryArray;
        setCategory1Title(category1Category?.name || "No Title");
        const category1ProductsData = await filterProductsByCategory(
          category1CategoryId
        );
        setCategory1Products(category1ProductsData.products || []);

        const category2CategoryArray = await getCategory(category2CategoryId);
        const category2Category = Array.isArray(category2CategoryArray)
          ? category2CategoryArray[0]
          : category2CategoryArray;
        setCategory2Title(category2Category?.name || "No Title");
        const category2ProductsData = await filterProductsByCategory(
          category2CategoryId
        );
        setCategory2Products(category2ProductsData.products || []);

        const category3CategoryArray = await getCategory(category3CategoryId);
        const category3Category = Array.isArray(category3CategoryArray)
          ? category3CategoryArray[0]
          : category3CategoryArray;
        setCategory3Title(category3Category?.name || "No Title");
        const category3ProductsData = await filterProductsByCategory(
          category3CategoryId
        );
        setCategory3Products(category3ProductsData.products || []);
      } catch (error) {
        console.error("Error fetching category or products:", error.message);
      }
    };

    fetchCategoryData();
  }, [category1CategoryId, category2CategoryId, category3CategoryId]);

  const renderProductSection = (title, products, page, setPage) => {
    // Calculate pagination
    const totalPages = Math.ceil(products.length / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const selectedProducts = products.slice(
      startIndex,
      startIndex + itemsPerPage
    );

    let items = [];
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === page}
          onClick={() => setPage(number)}
        >
          {number}
        </Pagination.Item>
      );
    }

    return (
      <section className="text-center category-section mb-4">
        <h4 className="mb-3 text-start fw-bold">{title}</h4>
        <Row className="justify-content-md-left">
          {Array.isArray(selectedProducts) && selectedProducts.length === 0 ? (
            <p>No products available in this category.</p>
          ) : (
            selectedProducts.map((product) => (
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
          <Button className="button_custom mt-4">View More Products</Button>
        </Link>
        <Pagination className="custom-pagination mt-4 justify-content-center">
          {items}
        </Pagination>
      </section>
    );
  };

  return (
    <Container>
      <header className="text-center mb-4" style={{ marginTop: "10rem" }}>
        <h3 style={{ color: "#d81b60 ", fontWeight: "bold" }}>
          Your Friendly Neighbourhood Minimart
        </h3>
      </header>

      {renderProductSection(
        category1Title,
        category1Products,
        category1Page,
        setCategory1Page
      )}
      {renderProductSection(
        category2Title,
        category2Products,
        category2Page,
        setCategory2Page
      )}
      {renderProductSection(
        category3Title,
        category3Products,
        category3Page,
        setCategory3Page
      )}
    </Container>
  );
};

export default Home;
