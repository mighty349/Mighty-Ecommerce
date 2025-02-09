import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../styles/AdminEditProduct.module.css";

function AdminEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    brand: "",
    current_price: "",
    original_price: "",
    discount: "",
    image_url: ""
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProduct();
  }, []);

  async function fetchProduct() {
    try {
      const response = await axios.get(`http://localhost:3000/product/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching product details:", error);
      setMessage("Error fetching product details.");
    }
  }

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:3000/admin/product/${id}`, product, {
        withCredentials: true,
      });
      setMessage("Product updated successfully.");
      setTimeout(() => navigate("/admin-dashboard"), 1000);
    } catch (error) {
      console.error("Error updating product:", error);
      setMessage("Error updating product.");
    }
  };

  return (
    <div className={styles.editWrapper}>
      <h2>Edit Product</h2>
      {message && <p className={styles.message}>{message}</p>}
      <div className={styles.form}>
        <label>Name:</label>
        <input type="text" name="name" value={product.name} onChange={handleChange} />

        <label>Brand:</label>
        <input type="text" name="brand" value={product.brand} onChange={handleChange} />

        <label>Current Price:</label>
        <input type="number" name="current_price" value={product.current_price} onChange={handleChange} />

        <label>Original Price:</label>
        <input type="number" name="original_price" value={product.original_price} onChange={handleChange} />

        <label>Discount:</label>
        <input type="number" name="discount" value={product.discount} onChange={handleChange} />

        <label>Image URL:</label>
        <input type="text" name="image_url" value={product.image_url} onChange={handleChange} />

        <button className={styles.updateButton} onClick={handleUpdate}>
          Update
        </button>
      </div>
    </div>
  );
}

export default AdminEditProduct;
