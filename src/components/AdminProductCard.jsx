import { Link } from "react-router-dom";
import styles from "../styles/AdminProductCard.module.css";

function AdminProductCard({ product, onEdit, onDelete }) {
  return (
    <div className={styles.cardWrapper}>
        <div className={styles.productCard}>
          <div className={styles.imageContainer}>
            <img
              src={product.image_url || "/placeholder.svg"}
              alt={product.name}
              className={styles.productImage}
            />
            
          </div>

          <div className={styles.productInfo}>
            <h3 className={styles.brand}>{product.brand}</h3>
            <p className={styles.productName}>{product.name}</p>
            <div className={styles.priceContainer}>
              <span className={styles.currentPrice}>₹{product.current_price}</span>
              {product.original_price && (
                <span className={styles.originalPrice}>₹{product.original_price}</span>
              )}
              {product.discount && (
                <span className={styles.discount}>{product.discount}% off</span>
              )}
            </div>
          </div>
        </div>
      <div className={styles.adminActions}>
        <button className={styles.editButton} onClick={() => onEdit(product.id)}>
          Edit
        </button>
        <button className={styles.deleteButton} onClick={() => onDelete(product.id)}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default AdminProductCard;
