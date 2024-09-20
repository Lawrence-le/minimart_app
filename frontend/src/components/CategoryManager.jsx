import { useState, useEffect } from "react";
import { Button, Form, Table, Modal } from "react-bootstrap";
import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../services/categoriesService";

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const result = await getCategories();
      setCategories(result);
    } catch (error) {
      console.error("Error fetching categories:", error.message);
    }
  };

  const handleAddCategory = async () => {
    try {
      await addCategory({ name: newCategory });
      setNewCategory("");
      fetchCategories();
      alert("New category added successfully!");
    } catch (error) {
      console.error("Error adding category:", error.message);
    }
  };

  const handleUpdateCategory = async () => {
    try {
      await updateCategory(selectedCategory.id, { name: newCategory });
      fetchCategories();
      setNewCategory("");
      setShowModal(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error("Error updating category:", error.message);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await deleteCategory(categoryId);
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error.message);
    }
  };

  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setNewCategory(category.name);
    setShowModal(true);
  };

  return (
    <div>
      <div className="mb-3">
        <p>
          <strong>Add New Category</strong>
        </p>
        <Form>
          <Form.Group className="d-flex">
            <Form.Control
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Category Name"
              className="mr-2 mb-2"
            />
          </Form.Group>
          <Button variant="dark mb-2" size="sm" onClick={handleAddCategory}>
            Add Category
          </Button>
        </Form>
      </div>

      <p>
        <strong>Manage Categories</strong>
      </p>
      <Table style={{ fontSize: "0.9em" }} striped bordered hover>
        <thead>
          <tr>
            <th style={{ width: "50%" }}>Category Name</th>
            <th style={{ width: "30%" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.name}</td>
              <td>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleEditClick(category)}
                  className="mr-2"
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteCategory(category.id)}
                  className="ms-2"
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Edit Category Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Control
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Category Name"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowModal(false)}
          >
            Close
          </Button>
          <Button variant="dark" size="sm" onClick={handleUpdateCategory}>
            Update Category
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CategoryManager;
