import { useState } from "react";
import {
  Navbar,
  InputGroup,
  Form,
  FormControl,
  Container,
  Row,
  Col,
  Button,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const SearchNavBar = () => {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (!query.trim()) {
      setError("Please enter a search query");
      return;
    }
    setError("");
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const handleInputChange = (event) => {
    setQuery(event.target.value);
    if (error) setError("");
  };

  const handleClearSearch = () => {
    setQuery("");
    setError("");
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
              <InputGroup className="mt-1 mb-1">
                <FormControl
                  type="search"
                  placeholder={error || "Search"}
                  aria-label="Search"
                  aria-describedby="search-icon"
                  value={query}
                  onChange={handleInputChange}
                />
                {/* {query && (
                  <Button
                    variant="outline-secondary"
                    onClick={handleClearSearch}
                    className="ms-2"
                  >
                    Clear
                  </Button>
                )} */}
                <Button
                  // variant="secondary"
                  onClick={handleSearchSubmit}
                  className="search-button"
                  id="search-icon"
                  // style={{ color: "orange" }}
                >
                  <span className="material-icons">search</span>
                </Button>
              </InputGroup>
            </Form>
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
};

export default SearchNavBar;
