import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "../styles/AdminAddProduct.module.css";

function AdminAddProduct() {
  const [product, setProduct] = useState({
    name: "",
    brand: "",
    current_price: "",
    original_price: "",
    discount: "",
    stock_quantity: "",
    image_url: ""
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/admin/add-product",
        product,
        { withCredentials: true }
      );
      setMessage(response.data.message);
      navigate("/admin-dashboard");
    } catch (error) {
      console.error("Error adding product:", error);
      setMessage("Error adding product.");
    }
  };

  return (
    <div className={styles.addProductWrapper}>
      <h2>Add New Product</h2>
      {message && <p className={styles.message}>{message}</p>}
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label htmlFor="name">Product Name</label>
          <input 
            type="text" 
            id="name"
            name="name" 
            value={product.name} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="brand">Brand</label>
          <input 
            type="text" 
            id="brand"
            name="brand" 
            value={product.brand} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="current_price">Current Price</label>
          <input 
            type="number" 
            id="current_price"
            name="current_price" 
            value={product.current_price} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="original_price">Original Price</label>
          <input 
            type="number" 
            id="original_price"
            name="original_price" 
            value={product.original_price} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="discount">Discount (%)</label>
          <input 
            type="number" 
            id="discount"
            name="discount" 
            value={product.discount} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="stock_quantity">Stock Quantity</label>
          <input 
            type="number" 
            id="stock_quantity"
            name="stock_quantity" 
            value={product.stock_quantity} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="image_url">Image URL</label>
          <input 
            type="text" 
            id="image_url"
            name="image_url" 
            value={product.image_url} 
            onChange={handleChange} 
            required 
          />
        </div>
        <button type="submit" className={styles.submitButton}>Add Product</button>
      </form>
      <button className={styles.backButton} onClick={() => navigate("/admin-dashboard")}>
        Back to Dashboard
      </button>
    </div>
  );
}

export default AdminAddProduct;
