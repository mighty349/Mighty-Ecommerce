import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminProductCard from "../components/AdminProductCard";
import styles from "../styles/AdminDashboard.module.css";

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch all products from the backend
  async function fetchProducts() {
    try {
      const response = await axios.get("http://localhost:3000/products", {
        withCredentials: true,
      });
      setProducts(response.data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
      setMessage("Error fetching products.");
    }
  }

  // Delete handler: call backend DELETE endpoint and update UI
  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:3000/admin/product/${productId}`, {
          withCredentials: true,
        });
        setProducts((prev) => prev.filter((product) => product.id !== productId));
      } catch (error) {
        console.error("Error deleting product:", error);
        setMessage("Error deleting product.");
      }
    }
  };

  // Edit handler: navigate to an edit page (assumed to be implemented)
  const handleEdit = (productId) => {
    navigate(`/admin/edit-product/${productId}`);
  };

  // Logout handler: call logout endpoint and navigate to login page
  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/logout",
        {},
        { withCredentials: true }
      );
      navigate("/admin-login");
    } catch (error) {
      console.error("Error logging out:", error);
      setMessage("Error logging out.");
    }
  };

  // Add product: navigate to a product creation page
  const handleAddProduct = () => {
    navigate("/admin/add-product");
  };

  return (
    <div className={styles.dashboardWrapper}>
      <header className={styles.header}>
        <button className={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
        <h1 className={styles.title}>Mighty‑Ecommerce</h1>
        <button className={styles.addProductButton} onClick={handleAddProduct}>
          Add More Products
        </button>
      </header>
      <main className={styles.mainContent}>
        {message && <p className={styles.message}>{message}</p>}
        <div className={styles.productGrid}>
          {products.map((product) => (
            <AdminProductCard
              key={product.id}
              product={product}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
