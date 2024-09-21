import React from "react"; // Make sure to import React if it's missing
import {
  Navbar,
  Form,
  FormControl,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // Don't forget this import

const SearchNavBar = () => {
  const navigate = useNavigate();

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const query = event.target.search.value;
    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <Navbar
      className="search-bar-navbar px-5 pt-3"
      fixed="top"
      style={{ marginTop: "55px" }}
    >
      <Container>
        <Row className="justify-content-center w-100">
          <Col md={6}>
            <Form className="d-flex" onSubmit={handleSearchSubmit}>
              <FormControl
                type="search"
                name="search"
                placeholder="Search"
                className="search-input"
                aria-label="Search"
              />
            </Form>
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
};

export default SearchNavBar;
