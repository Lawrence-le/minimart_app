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

const SearchNavBar = ({ username }) => {
  // Accept username as a prop
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
    <Navbar className="search-bar-navbar " fixed="top">
      <Container>
        <Row className="justify-content-center w-100 align-items-center">
          <Col md={3}>
            <span style={{ color: "black" }}>
              Welcome <strong>{username}</strong>
            </span>
          </Col>
          <Col md={4}>
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
                <Button
                  onClick={handleSearchSubmit}
                  className="search-button"
                  id="search-icon"
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
