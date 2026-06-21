import  { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import { Heart } from 'lucide-react';

export const WishlistPage = () => {
  const { wishlist } = useApp();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all products to match with wishlist ids
  useEffect(() => {
    const fetchWishlistDetails = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (err) {
        console.error('Error loading wishlist details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlistDetails();
  }, []);

  // Filter products by wishlist ids
  const favoritedItems = products.filter((p) => wishlist.includes(p.id));

  if (loading) {
    return (
      <main className="main-content" id="main-content">
        <div className="loading-container" aria-live="polite" aria-busy="true">
          <div className="spinner"></div>
          <p>Retrieving your wishlist...</p>
        </div>
      </main>
    );
  }

  if (favoritedItems.length === 0) {
    return (
      <main className="main-content" id="main-content">
        <div className="empty-state">
          <Heart size={64} aria-hidden="true" style={{ color: 'hsl(var(--text-muted))' }} />
          <h1 style={{ fontSize: '1.75rem', fontWeight: 600 }}>Your Wishlist is Empty</h1>
          <p>Tap the heart icon on any product to save it for later.</p>
          <Link to="/" className="btn">
            Browse Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="main-content" id="main-content">
      <h1 style={{ marginBottom: '32px', fontSize: '2rem' }}>My Wishlist</h1>
      
      <section aria-label="Favorited items grid">
        <div className="products-grid">
          {favoritedItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
};
export default WishlistPage;
