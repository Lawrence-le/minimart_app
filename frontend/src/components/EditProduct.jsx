import { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import {
  updateProduct,
  uploadProductImage,
  getProductById,
  deleteProductImage,
} from "../services/productsService";
import { getCategories } from "../services/categoriesService";

const EditProduct = ({ productId }) => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category_id: "",
    image_url: "",
  });
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error.message);
      }
    };

    const fetchProduct = async () => {
      try {
        const productData = await getProductById(productId);
        if (productData && productData.product) {
          setProduct(productData.product);
          setImagePreview(productData.product.image_url);
        }
      } catch (error) {
        console.error("Error fetching product:", error.message);
      }
    };

    fetchCategories();
    fetchProduct();
  }, [productId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
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

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      let uploadedImageUrl = "";

      // Delete the existing product image if a new file is selected
      if (file) {
        await deleteProductImage(productId);
        const uploadedImage = await uploadProductImage(file);
        uploadedImageUrl = uploadedImage.url;
      }

      const productToUpdate = {
        ...product,
        image_url: uploadedImageUrl || product.image_url,
      };

      await updateProduct(productId, productToUpdate);
      alert("Product updated successfully!");
    } catch (error) {
      console.error("Error updating product:", error.message);
    }
  };

  return (
    <Form onSubmit={handleUpdate}>
      <Form.Group controlId="formName">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={product.name || ""}
          onChange={handleInputChange}
        />
      </Form.Group>
      <Form.Group controlId="formDescription">
        <Form.Label className="mt-3">Description</Form.Label>
        <Form.Control
          as="textarea"
          name="description"
          value={product.description || ""}
          onChange={handleInputChange}
        />
      </Form.Group>
      <Form.Group controlId="formPrice">
        <Form.Label className="mt-3">Price</Form.Label>
        <Form.Control
          type="number"
          name="price"
          value={product.price || ""}
          onChange={handleInputChange}
          className="no-spinner custom-input"
        />
      </Form.Group>
      <Form.Group controlId="formStock">
        <Form.Label className="mt-3">Stock</Form.Label>
        <Form.Control
          type="number"
          name="stock"
          value={product.stock || ""}
          onChange={handleInputChange}
          className="no-spinner custom-input"
        />
      </Form.Group>
      <Form.Group controlId="formCategory">
        <Form.Label className="mt-3">Category</Form.Label>
        <Form.Control
          as="select"
          name="category_id"
          value={product.category_id || ""}
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
      <Button className="mb-5" size="sm" variant="dark" type="submit">
        Update Product
      </Button>
    </Form>
  );
};

export default EditProduct;
