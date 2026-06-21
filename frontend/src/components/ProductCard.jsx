import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Heart, Star } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { wishlist, toggleWishlist } = useApp();
  const isWishlisted = wishlist.includes(product.id);

  const handleWishlistClick = (e) => {
    e.preventDefault(); // Prevent navigating to detail page on heart click
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <article className="product-card">
      <Link to={`/product/${product.id}`} className="product-card-link" aria-label={`View details for ${product.name}`}>
        {/* Out of Stock Overlay */}
        {!product.inStock && (
          <span className="out-of-stock-badge">
            Out of Stock
          </span>
        )}

        {/* Product Image Wrapper */}
        <div className="product-card-img-wrapper">
          <img
            src={product.image}
            alt="" // Decorative since card has descriptive aria-label, preventing redundancy
            loading="lazy"
            className="product-card-img"
          />
          {/* Wishlist Button */}
          <button
            type="button"
            className={`wishlist-heart-btn ${isWishlisted ? 'active' : ''}`}
            onClick={handleWishlistClick}
            aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          >
            <Heart
              size={18}
              fill={isWishlisted ? 'currentColor' : 'none'}
              aria-hidden="true"
            />
          </button>
        </div>

        {/* Product Content Details */}
        <div className="product-card-info">
          <span className="product-card-category">{product.category}</span>
          <h3 className="product-card-title">{product.name}</h3>

          {/* Rating summary */}
          <div className="product-card-rating">
            <Star size={14} fill="currentColor" aria-hidden="true" />
            <span>
              {product.rating} <span className="sr-only">out of 5 stars</span> ({product.reviewCount})
            </span>
          </div>

          {/* Price & Status */}
          <div className="product-card-price-row">
            <span className="product-card-price">${product.price.toFixed(2)}</span>
          </div>
        </div>
      </Link>
    </article>
  );
};
export default ProductCard;
