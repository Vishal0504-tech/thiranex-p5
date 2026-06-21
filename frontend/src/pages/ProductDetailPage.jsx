import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Heart, ShoppingCart, Star, ChevronLeft, Award } from 'lucide-react';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart, wishlist, toggleWishlist } = useApp();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('specs'); // 'specs' or 'reviews'
  const [addedMessage, setAddedMessage] = useState(false);

  const isWishlisted = wishlist.includes(id);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) {
          if (res.status === 404) throw new Error('Product not found.');
          throw new Error('Could not fetch product details.');
        }
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err.message || 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product.id);
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 2500);
  };

  if (loading) {
    return (
      <main className="main-content" id="main-content">
        <div className="loading-container" aria-live="polite" aria-busy="true">
          <div className="spinner"></div>
          <p>Loading product details...</p>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="main-content" id="main-content">
        <div className="empty-state" role="alert">
          <h2>Error Occurred</h2>
          <p style={{ color: 'hsl(var(--error))' }}>{error || 'Product information is missing.'}</p>
          <Link to="/" className="btn">Return to Catalog</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="main-content" id="main-content">
      {/* Back button */}
      <Link to="/" className="btn btn-secondary" style={{ marginBottom: '24px', alignSelf: 'flex-start' }} aria-label="Go back to product catalog">
        <ChevronLeft size={16} aria-hidden="true" />
        <span>Back to Catalog</span>
      </Link>

      <div className="detail-layout">
        {/* Product Image */}
        <div className="detail-img-container">
          <img
            src={product.image}
            alt={`Studio shot of ${product.name}`}
            className="detail-img"
          />
        </div>

        {/* Product Details */}
        <div className="detail-info">
          <span className="detail-category">{product.category}</span>
          <h1 className="detail-title">{product.name}</h1>

          {/* Rating */}
          <div className="detail-rating-row">
            <div className="detail-rating">
              <Star size={18} fill="currentColor" aria-hidden="true" />
              <span style={{ fontWeight: 600 }}>{product.rating}</span>
            </div>
            <span style={{ color: 'hsl(var(--text-muted))' }}>
              Based on {product.reviewCount} customer reviews
            </span>
          </div>

          {/* Price */}
          <div className="detail-price">${product.price.toFixed(2)}</div>

          {/* Description */}
          <p>{product.description}</p>

          {/* Stock Status */}
          <div style={{ margin: '8px 0' }}>
            {product.inStock ? (
              <span className="stock-status in-stock" role="status">
                ● In Stock ({product.stockCount} remaining)
              </span>
            ) : (
              <span className="stock-status out-of-stock" role="status">
                ● Temporarily Out of Stock
              </span>
            )}
          </div>

          {/* Add/Wishlist Actions */}
          <div className="detail-actions">
            <button
              type="button"
              className="btn"
              disabled={!product.inStock}
              onClick={handleAddToCart}
              style={{ flexGrow: 1, gap: '10px' }}
            >
              <ShoppingCart size={18} aria-hidden="true" />
              <span>Add to Shopping Cart</span>
            </button>

            <button
              type="button"
              className={`btn btn-secondary ${isWishlisted ? 'active' : ''}`}
              onClick={() => toggleWishlist(product.id)}
              aria-label={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              style={{ padding: '12px' }}
            >
              <Heart
                size={20}
                fill={isWishlisted ? 'hsl(var(--error))' : 'none'}
                color={isWishlisted ? 'hsl(var(--error))' : 'currentColor'}
                aria-hidden="true"
              />
            </button>
          </div>

          {/* Live feedback alert region */}
          <div aria-live="polite" style={{ height: '24px', marginTop: '8px' }}>
            {addedMessage && (
              <p style={{ color: 'hsl(var(--success))', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={16} aria-hidden="true" />
                <span>Added to cart successfully!</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Tabs section for specs/reviews */}
      <section className="detail-tabs-section" aria-label="Product specifications and reviews">
        <div className="tabs-header" role="tablist">
          <button
            id="tab-specs"
            role="tab"
            type="button"
            aria-selected={activeTab === 'specs'}
            aria-controls="panel-specs"
            className={`tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
            onClick={() => setActiveTab('specs')}
          >
            Technical Specs
          </button>
          <button
            id="tab-reviews"
            role="tab"
            type="button"
            aria-selected={activeTab === 'reviews'}
            aria-controls="panel-reviews"
            className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews ({product.reviews?.length || 0})
          </button>
        </div>

        {/* Specs tab content */}
        <div
          id="panel-specs"
          role="tabpanel"
          aria-labelledby="tab-specs"
          hidden={activeTab !== 'specs'}
          className="tab-content"
          tabIndex="0"
        >
          <table className="specs-table">
            <tbody>
              {Object.entries(product.specs || {}).map(([key, value]) => (
                <tr key={key}>
                  <th scope="row">{key}</th>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Reviews tab content */}
        <div
          id="panel-reviews"
          role="tabpanel"
          aria-labelledby="tab-reviews"
          hidden={activeTab !== 'reviews'}
          className="tab-content"
          tabIndex="0"
        >
          <div className="reviews-list">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((rev) => (
                <article className="review-card" key={rev.id}>
                  <div className="review-card-header">
                    <span className="review-user">{rev.user}</span>
                    <span className="review-date">{rev.date}</span>
                  </div>
                  <div className="review-rating" aria-label={`${rev.rating} star rating`}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill={i < rev.rating ? 'currentColor' : 'none'}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <p style={{ marginTop: '8px', fontStyle: 'italic', color: 'hsl(var(--text-main))' }}>
                    "{rev.comment}"
                  </p>
                </article>
              ))
            ) : (
              <p>No reviews have been written for this product yet.</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};
export default ProductDetailPage;
