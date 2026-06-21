import   { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react';

export const CartPage = () => {
  const { cart, updateCartQuantity, removeFromCart } = useApp();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all products to match with cart ids and display fresh prices/metadata
  useEffect(() => {
    const fetchCartDetails = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (err) {
        console.error('Error loading cart details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCartDetails();
  }, []);

  // Compute cart products
  const cartItems = cart
    .map((cartItem) => {
      const match = products.find((p) => p.id === cartItem.id);
      if (!match) return null;
      return {
        ...match,
        quantity: cartItem.quantity
      };
    })
    .filter(Boolean);

  // Compute Prices
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const shippingThreshold = 150.00;
  const shipping = subtotal > shippingThreshold || subtotal === 0 ? 0.00 : 15.00;
  const total = subtotal + tax + shipping;

  if (loading) {
    return (
      <main className="main-content" id="main-content">
        <div className="loading-container" aria-live="polite" aria-busy="true">
          <div className="spinner"></div>
          <p>Analyzing cart items...</p>
        </div>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="main-content" id="main-content">
        <div className="empty-state">
          <ShoppingBag size={64} aria-hidden="true" />
          <h1 style={{ fontSize: '1.75rem', fontWeight: 600 }}>Your Cart is Empty</h1>
          <p>Fill it with premium gadgets and accessories from our catalog.</p>
          <Link to="/" className="btn">
            Browse Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="main-content" id="main-content">
      <h1 style={{ marginBottom: '32px', fontSize: '2rem' }}>Shopping Cart</h1>

      <div className="cart-layout">
        {/* Left Side: Cart Items list */}
        <section aria-label="Items in your cart" className="cart-items-container">
          {cartItems.map((item) => (
            <article className="cart-item" key={item.id}>
              {/* Product Thumbnail */}
              <img
                src={item.image}
                alt={`Thumbnail of ${item.name}`}
                className="cart-item-img"
              />

              {/* Title & Info */}
              <div className="cart-item-info">
                <span className="cart-item-category">{item.category}</span>
                <Link to={`/product/${item.id}`} className="cart-item-title">
                  {item.name}
                </Link>
                <span className="cart-item-price">${item.price.toFixed(2)}</span>
              </div>

              {/* Quantity Selector controls */}
              <div className="cart-item-controls">
                <div className="quantity-selector" aria-label="Quantity selector">
                  <button
                    type="button"
                    className="quantity-btn"
                    onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                    aria-label={`Decrease quantity of ${item.name}`}
                  >
                    &minus;
                  </button>
                  <span className="quantity-val" aria-live="polite" aria-label={`${item.quantity} items`}>
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    className="quantity-btn"
                    onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                    aria-label={`Increase quantity of ${item.name}`}
                    disabled={item.quantity >= item.stockCount}
                  >
                    &#43;
                  </button>
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => removeFromCart(item.id)}
                  aria-label={`Remove ${item.name} from shopping cart`}
                  style={{ color: 'hsl(var(--error))' }}
                >
                  <Trash2 size={18} aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </section>

        {/* Right Side: Order Summary Panel */}
        <aside aria-label="Order Summary">
          <div className="summary-card">
            <h2>Order Summary</h2>
            
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Est. Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
            </div>

            {shipping > 0 && (
              <p style={{ fontSize: '0.8rem', color: 'hsl(var(--accent))', marginTop: '-10px' }}>
                Add ${(shippingThreshold - subtotal).toFixed(2)} more for FREE shipping!
              </p>
            )}

            <div className="summary-row total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <Link to="/checkout" className="btn" style={{ width: '100%', gap: '8px', marginTop: '12px' }}>
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
};
export default CartPage;
