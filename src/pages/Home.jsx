import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import styles from "../styles/Home.module.css";

function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await axios.get(`http://localhost:3000/products?page=${page}`, {
          withCredentials: true,
        });
        if (page === 1) {
          setProducts(response.data.products);
        } else {
          setProducts((prevProducts) => [...prevProducts, ...response.data.products]);
        }
        setHasMore(response.data.hasMore);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

    fetchProducts();
  }, [page]);

  function loadMore() {
    setPage((prevPage) => prevPage + 1);
  }

  async function handleLogout() {
    try {
      await axios.post("http://localhost:3000/logout", {}, { withCredentials: true });
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  }

  return (
    <div className={styles.home}>
      
      <div className={styles.header}>
      <button 
          className={styles.cartButton}
          onClick={() => navigate('/cart')}
        >
          🛒 View Cart
        </button>
        <div className={styles.title}>
          <h1>Welcome to Mighty Ecommerce</h1>
        </div>
        <div className={styles.logout}>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
      <div className={styles.productGrid}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {hasMore && (
        <div className={styles.loadMore}>
          <button onClick={loadMore}>Load More</button>
        </div>
      )}
    </div>
  );
}

export default Home;
