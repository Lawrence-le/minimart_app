//frontend\src\components\AddProduct.jsx

import { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import {
  addProduct,
  updateProduct,
  uploadProductImage,
} from "../services/productsService";
import { getCategories } from "../services/categoriesService"; // Import the categories service

const AddProduct = () => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category_id: "",
    image_url: "",
  });
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [categories, setCategories] = useState([]); // State to store categories

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error.message);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setImagePreview("");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault(); //
    try {
      let uploadedImageUrl = "";

      // Upload the image first if a file is selected
      if (file) {
        const uploadedImage = await uploadProductImage(file);
        uploadedImageUrl = uploadedImage.url;
      }

      // Add the image URL to newProduct
      const productToSave = {
        ...newProduct,
        image_url: uploadedImageUrl,
      };

      // Save or update the product
      if (!newProduct.id) {
        await addProduct(productToSave); // Add new product
      } else {
        await updateProduct(newProduct.id, productToSave); // Update existing product
      }

      alert("Product saved successfully!");

      // Clear the form after saving
      setNewProduct({
        name: "",
        description: "",
        price: "",
        stock: "",
        category_id: "",
        image_url: "",
      });
      setFile("");
      setImagePreview("");
    } catch (error) {
      console.error("Error saving product:", error.message);
    }
  };

  return (
    <Form>
      <Form.Group controlId="formName">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={newProduct.name}
          onChange={handleInputChange}
        />
      </Form.Group>
      <Form.Group controlId="formDescription">
        <Form.Label className="mt-3">Description</Form.Label>
        <Form.Control
          as="textarea"
          name="description"
          value={newProduct.description}
          onChange={handleInputChange}
        />
      </Form.Group>
      <Form.Group controlId="formPrice">
        <Form.Label className="mt-3">Price</Form.Label>
        <Form.Control
          type="number"
          name="price"
          value={newProduct.price}
          a
          onChange={handleInputChange}
          className="no-spinner custom-input"
        />
      </Form.Group>
      <Form.Group controlId="formStock">
        <Form.Label className="mt-3">Stock</Form.Label>
        <Form.Control
          type="number"
          name="stock"
          value={newProduct.stock}
          onChange={handleInputChange}
          className="no-spinner custom-input"
        />
      </Form.Group>
      <Form.Group controlId="formCategory">
        <Form.Label className="mt-3">Category</Form.Label>
        <Form.Control
          as="select"
          name="category_id"
          value={newProduct.category_id}
          onChange={handleInputChange}
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      <Form.Group controlId="formImage" className="mt-3 mb-3">
        <Form.Label>Product Image</Form.Label>
        <Form.Control type="file" onChange={handleFileChange} />
        {imagePreview && (
          <div className="mt-3">
            <img src={imagePreview} alt="Preview" className="preview-image" />
          </div>
        )}
      </Form.Group>
      <Button className="mb-5" size="sm" variant="dark" onClick={handleSave}>
        Save Product
      </Button>
    </Form>
  );
};

export default AddProduct;
