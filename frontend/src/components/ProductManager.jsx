import { useState, useEffect } from "react";
import { Button, Table, Form, Row, Col, Modal } from "react-bootstrap";
import {
  getProducts,
  deleteProduct,
  filterProductsByCategory,
  searchProducts,
} from "../services/productsService";
import { getCategories } from "../services/categoriesService";
import AddProduct from "./AddProduct";
import EditProduct from "./EditProduct";
import { format } from "date-fns";

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc");

  // Fetch all products (no filtering)
  const fetchProducts = async () => {
    try {
      const productsData = await getProducts();
      const sortedProducts = productsData.products.sort((a, b) => {
        if (sortOrder === "asc") {
          return new Date(a.created_at) - new Date(b.created_at);
        } else {
          return new Date(b.created_at) - new Date(a.created_at);
        }
      });
      setProducts(sortedProducts);
    } catch (error) {
      console.error("Error fetching products:", error.message);
    }
  };

  // Fetch products by selected category
  const fetchProductsByCategory = async (categoryId) => {
    try {
      const productsData = await filterProductsByCategory(categoryId);
      const sortedProducts = productsData.products.sort((a, b) => {
        if (sortOrder === "asc") {
          return new Date(a.created_at) - new Date(b.created_at);
        } else {
          return new Date(b.created_at) - new Date(a.created_at);
        }
      });
      setProducts(sortedProducts);
    } catch (error) {
      console.error("Error fetching products by category:", error.message);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching categories:", error.message);
    }
  };

  // Search products by name or description
  const fetchSearchedProducts = async (query) => {
    try {
      const productsData = await searchProducts(query);
      const sortedProducts = productsData.products.sort((a, b) => {
        if (sortOrder === "asc") {
          return new Date(a.created_at) - new Date(b.created_at);
        } else {
          return new Date(b.created_at) - new Date(a.created_at);
        }
      });
      setProducts(sortedProducts);
    } catch (error) {
      console.error("Error searching products:", error.message);
    }
  };

  // Handle deleting a product
  const handleDeleteProduct = async () => {
    try {
      if (selectedProductId !== null) {
        await deleteProduct(selectedProductId);
        fetchProducts();
      }
    } catch (error) {
      console.error("Error deleting product:", error.message);
    } finally {
      setShowDeleteModal(false);
    }
  };

  // Handle category change
  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    setSearchKeyword("");
    if (categoryId) {
      fetchProductsByCategory(categoryId);
    } else {
      fetchProducts();
    }
  };

  // Handle search functionality
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchKeyword(query);
    setSelectedCategory("");
    if (query) {
      fetchSearchedProducts(query);
    } else {
      fetchProducts();
    }
  };

  // Handle Edit button click
  const handleEditProduct = (productId) => {
    setSelectedProductId(productId);
    setShowEditModal(true);
  };

  // Prevent form submission when pressing "Enter"
  const handleFormSubmit = (e) => {
    e.preventDefault();
  };

  // Handle modal open/close for Add Product
  const handleShowAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => setShowAddModal(false);

  // Handle modal close for Edit Product
  const handleCloseEditModal = () => setShowEditModal(false);

  // Toggle sort order
  const handleSortByDate = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    fetchProducts();
  };

  // Show delete confirmation modal
  const handleShowDeleteModal = (productId) => {
    setSelectedProductId(productId);
    setShowDeleteModal(true);
  };

  // Close delete confirmation modal
  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);
  // }, [sortOrder]);

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown Category";
  };

  return (
    <div>
      <h5 className="mb-3">Inventory</h5>
      <Button
        variant="dark"
        size="sm"
        onClick={handleShowAddModal}
        className="mb-3"
      >
        Add Product
      </Button>

      <Button
        variant="secondary"
        size="sm"
        onClick={fetchProducts}
        className="mb-3 ms-2"
      >
        Refresh
      </Button>

      <Form className="mb-3" onSubmit={handleFormSubmit}>
        <p>Filter by 1 or 2</p>
        <Row>
          <Col>
            <Form.Group controlId="formSearch">
              <Form.Control
                type="text"
                placeholder="1. Search products..."
                value={searchKeyword}
                onChange={handleSearchChange}
                className="mr-sm-2"
              />
            </Form.Group>
          </Col>

          <Col>
            <Form.Group controlId="formCategory">
              <Form.Control
                as="select"
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="mr-sm-2"
              >
                <option value="">2. All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
      </Form>

      <Table className="list-font" striped bordered hover>
        <thead>
          <tr>
            <th
              style={{ width: "12%" }}
              onClick={handleSortByDate}
              style={{ cursor: "pointer" }}
            >
              Created At {sortOrder === "desc" ? "▼" : "▲"}
            </th>
            <th style={{ width: "8%" }}>Image</th>
            <th style={{ width: "20%" }}>Name</th>
            <th style={{ width: "25%" }}>Description</th>
            <th style={{ width: "5%" }}>Price</th>
            <th style={{ width: "5%" }}>Stock</th>
            <th style={{ width: "8%" }}>Category</th>

            <th style={{ width: "14%" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="8">No products available</td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product.id}>
                <td>{format(new Date(product.created_at), "dd MMM yyyy")}</td>
                <td>
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      style={{ width: "100px", height: "auto" }}
                    />
                  ) : (
                    "Image not available"
                  )}
                </td>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.price}</td>
                <td>{product.stock}</td>
                <td>{getCategoryName(product.category_id)}</td>

                <td>
                  <Button
                    className="ml-2 ms-2"
                    variant="secondary"
                    size="sm"
                    onClick={() => handleEditProduct(product.id)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    className="ml-2 ms-2"
                    onClick={() => handleShowDeleteModal(product.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* Add Product Modal */}
      <Modal show={showAddModal} onHide={handleCloseAddModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddProduct onClose={handleCloseAddModal} />
        </Modal.Body>
      </Modal>

      {/* Edit Product Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EditProduct
            productId={selectedProductId}
            onClose={handleCloseEditModal}
          />
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this product?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleCloseDeleteModal}
          >
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={handleDeleteProduct}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProductManager;
