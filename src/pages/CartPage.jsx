import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../styles/CartPage.module.css";

function CartPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.price_at_adding * item.quantity);
    }, 0).toFixed(2);
  };

  const fetchCart = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/cart", {
        withCredentials: true
      });
      setCartItems(response.data);
      setLoading(false);
    } catch (error) {
      setError("Failed to load cart items");
      setLoading(false);
    }
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    try {
      if(newQuantity < 1) return;
      
      await axios.put(
        `http://localhost:3000/api/cart/${itemId}`,
        { quantity: newQuantity },
        { withCredentials: true }
      );

      setCartItems(items => 
        items.map(item => 
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("Failed to update quantity");
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await axios.delete(`http://localhost:3000/api/cart/${itemId}`, {
        withCredentials: true
      });
      
      setCartItems(items => items.filter(item => item.id !== itemId));
    } catch (error) {
      console.error("Error removing item:", error);
      alert("Failed to remove item");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // ... loading and error states remain the same ...

  return (
    <div className={styles.cartContainer}>
      <h1>Your Shopping Cart</h1>
      <button onClick={() => navigate(-1)} className={styles.continueShopping}>
        ← Continue Shopping
      </button>

      {cartItems.length === 0 ? (
        <div className={styles.emptyCart}>Your cart is empty</div>
      ) : (
        <>
          <div className={styles.cartTable}>
            <div className={styles.tableHeader}>
              <div className={styles.headerItem}>Product</div>
              <div className={styles.headerItem}>Price</div>
              <div className={styles.headerItem}>Quantity</div>
              <div className={styles.headerItem}>Total</div>
              <div className={styles.headerItem}>Actions</div>
            </div>

            {cartItems.map((item) => (
              <div key={item.id} className={styles.tableRow}>
                <div className={styles.productCell}>
                  <img 
                    src={item.image_url || "/placeholder.svg"} 
                    alt={item.name} 
                    className={styles.productImage}
                  />
                  <span className={styles.productName}>{item.name}</span>
                </div>
                <div className={styles.priceCell}>
                  ${Number(item.price_at_adding).toFixed(2)}
                </div>
                <div className={styles.quantityCell}>
                  <div className={styles.quantityControls}>
                    <button 
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button 
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className={styles.totalCell}>
                  ${(item.price_at_adding * item.quantity).toFixed(2)}
                </div>
                <div className={styles.actionsCell}>
                  <button 
                    onClick={() => handleRemoveItem(item.id)}
                    className={styles.removeButton}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            {/* ... total row remains the same ... */}
          </div>

          <div className={styles.totalRow}>
              <div className={styles.totalLabel}>Grand Total:</div>
              <div className={styles.totalValue}>${calculateTotal()}</div>
            </div>
          

          <button 
            className={styles.checkoutButton}
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
          </button>
        </>

        
      )}
    </div>
  );
}

export default CartPage;