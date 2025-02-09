import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../styles/ProductDisplay.module.css";

function ProductDisplay() {
  const { id } = useParams();  // Get product id from URL
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);  // Store product data
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // Fetch product details from the server using the product id
    async function fetchProduct() {
      try {
        const response = await axios.get(`http://localhost:3000/product/${id}`);
        // Explicitly convert current_price to a number
        const fetchedProduct = {
          ...response.data,
          current_price: parseFloat(response.data.current_price),  // Ensure it's a number
          original_price: response.data.original_price ? parseFloat(response.data.original_price) : null, // Ensure it's a number
        };
        setProduct(fetchedProduct);  // Set the product data
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    }

    fetchProduct();
  }, [id]);  // Run the effect when the id changes

  // Handle quantity change
  function handleQuantityChange(change) {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  }

  // Handle adding the product to the cart
  async function handleAddToCart() {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/cart/add",
        {
          productId: id,
          quantity: quantity,
        },
        { withCredentials: true } // Important for session cookies
      );
      
      console.log("Added to cart:", response.data);
      alert("Item added to cart successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert(error.response?.data?.error || "Failed to add item to cart");
    }
  }

  // Render loading state or product details
  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.productDisplay}>
      <div className={styles.container}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          ← Back to Products
        </button>

        <div className={styles.productCard}>
          <div className={styles.productImage}>
            <img src={product.image_url || "/placeholder.svg"} alt={product.name} />
          </div>

          <div className={styles.productDetails}>
            <h1 className={styles.productName}>{product.name}</h1>
            <p className={styles.productBrand}>{product.brand}</p>

            <div className={styles.productPrice}>
              <span className={styles.currentPrice}>
                ${product.current_price.toFixed(2)}
              </span>
              {product.original_price && (
                <span className={styles.originalPrice}>
                  ${product.original_price.toFixed(2)}
                </span>
              )}
              {product.discount && (
                <span className={styles.discountTag}>{product.discount}% OFF</span>
              )}
            </div>

            <div className={styles.productDescription}>
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            <div className={styles.quantitySelector}>
              <span>Quantity:</span>
              <div className={styles.quantityControls}>
                <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>-</button>
                <span>{quantity}</span>
                <button onClick={() => handleQuantityChange(1)}>+</button>
              </div>
            </div>

            <button className={styles.addToCartBtn} onClick={handleAddToCart}>
              Add to Cart
            </button>

           

              <button 
                  className={styles.viewCartButton}
                  onClick={() => navigate('/cart')}
              >
                  🛒 View Cart
              </button>

            
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDisplay;
