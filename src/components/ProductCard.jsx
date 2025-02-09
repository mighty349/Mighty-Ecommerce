import { Link } from "react-router-dom";
import styles from "../styles/ProductCard.module.css"; // Correct import

function ProductCard({ product }) {
  return (
    <Link to={`/product/${product.id}`} className={styles.productCardLink}>
      <div className={styles.productCard}>
        <div className={styles.imageContainer}>
          <img src={product.image_url || "/placeholder.svg"} alt={product.name} className={styles.productImage} />
          <div className={styles.quickViewOverlay}>
            <button className={styles.quickViewButton}>View Details</button>
          </div>
        </div>

        <div className={styles.productInfo}>
          <h3 className={styles.brand}>{product.brand}</h3>
          <p className={styles.productName}>{product.name}</p>

          <div className={styles.priceContainer}>
            <span className={styles.currentPrice}>₹{product.current_price}</span>
            {product.original_price && <span className={styles.originalPrice}>₹{product.original_price}</span>}
            {product.discount && <span className={styles.discount}>{product.discount}% off</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
