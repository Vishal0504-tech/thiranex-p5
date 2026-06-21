import   { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import KeyboardTrapModal from '../components/KeyboardTrapModal';
import { CheckCircle2, AlertCircle, ShoppingBag } from 'lucide-react';

export const CheckoutPage = () => {
  const { cart, clearCart } = useApp();
  const navigate = useNavigate();

  // Data matching state
  const [products, setProducts] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(true);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  // Validation States
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  // Modal receipt states
  const [modalOpen, setModalOpen] = useState(false);
  const [receipt, setReceipt] = useState(null);

  // Fetch product definitions to calculate matching names/prices
  useEffect(() => {
    const fetchCheckoutDetails = async () => {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (err) {
        console.error('Error fetching checkout details:', err);
      } finally {
        setLoadingDetails(false);
      }
    };
    fetchCheckoutDetails();
  }, []);

  // Sync back to catalog if cart is empty and modal is closed
  useEffect(() => {
    if (!modalOpen && cart.length === 0 && !loadingDetails) {
      navigate('/');
    }
  }, [cart, modalOpen, navigate, loadingDetails]);

  // Match items
  const summaryItems = cart
    .map((cartItem) => {
      const match = products.find((p) => p.id === cartItem.id);
      if (!match) return null;
      return {
        ...match,
        quantity: cartItem.quantity
      };
    })
    .filter(Boolean);

  const subtotal = summaryItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const shipping = subtotal > 150 ? 0 : 15.00;
  const total = subtotal + tax + shipping;

  // Validation Check
  const validateForm = () => {
    const newErrors = {};
    
    if (!fullName.trim()) newErrors.fullName = 'Full name is required.';
    
    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Enter a valid email address.';
    }

    if (!address.trim()) newErrors.address = 'Shipping address is required.';
    if (!city.trim()) newErrors.city = 'City is required.';
    
    if (!zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required.';
    } else if (!/^\d{5,6}$/.test(zipCode.trim())) {
      newErrors.zipCode = 'Enter a valid 5 or 6 digit ZIP code.';
    }

    if (!cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required.';
    } else if (!/^\d{16}$/.test(cardNumber.replace(/\s+/g, ''))) {
      newErrors.cardNumber = 'Card number must be 16 digits.';
    }

    if (!expiryDate.trim()) {
      newErrors.expiryDate = 'Expiry date is required.';
    } else if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      newErrors.expiryDate = 'Expiry must match MM/YY format.';
    }

    if (!cvv.trim()) {
      newErrors.cvv = 'CVV is required.';
    } else if (!/^\d{3,4}$/.test(cvv.trim())) {
      newErrors.cvv = 'CVV must be 3 or 4 digits.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const payload = {
        items: cart.map((item) => ({ id: item.id, quantity: item.quantity })),
        shippingDetails: { fullName, email, address, city, zipCode },
        paymentDetails: { cardNumber: cardNumber.replace(/\s+/g, ''), expiryDate }
      };

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Server rejected checkout transaction.');
      }

      // Success
      setReceipt(result);
      clearCart(); // Wipes context cart
      setModalOpen(true); // Triggers Focus Trap Modal receipt
    } catch (err) {
      setServerError(err.message || 'Checkout connection error.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    navigate('/');
  };

  if (loadingDetails) {
    return (
      <main className="main-content" id="main-content">
        <div className="loading-container" aria-live="polite" aria-busy="true">
          <div className="spinner"></div>
          <p>Preparing secure gateway...</p>
        </div>
      </main>
    );
  }

  if (cart.length === 0 && !modalOpen) {
    return (
      <main className="main-content" id="main-content">
        <div className="empty-state">
          <ShoppingBag size={64} aria-hidden="true" />
          <h1>Your Cart is Empty</h1>
          <p>You cannot checkout with an empty cart.</p>
          <Link to="/" className="btn">Return to Catalog</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="main-content" id="main-content">
      <h1 style={{ marginBottom: '32px', fontSize: '2rem' }}>Secure Checkout</h1>

      {serverError && (
        <div className="empty-state" role="alert" style={{ padding: '16px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid hsl(var(--error))', borderRadius: '12px', marginBottom: '24px', flexDirection: 'row', gap: '12px' }}>
          <AlertCircle color="red" size={24} aria-hidden="true" />
          <p style={{ color: 'hsl(var(--error))', fontWeight: 600, textAlign: 'left' }}>{serverError}</p>
        </div>
      )}

      <div className="checkout-layout">
        {/* Billing & Shipping Form */}
        <section aria-labelledby="form-section-title">
          <h2 id="form-section-title" className="sr-only">Billing and Shipping Details</h2>
          <form className="form-card" onSubmit={handleFormSubmit} noValidate>
            
            <h3 style={{ borderBottom: '1px solid hsl(var(--border))', paddingBottom: '8px' }}>Shipping Information</h3>
            
            {/* Full Name */}
            <div className="form-group">
              <label htmlFor="fullname">Full Name</label>
              <input
                id="fullname"
                type="text"
                className="form-input"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                aria-invalid={!!errors.fullName}
                aria-describedby={errors.fullName ? 'err-fullname' : undefined}
                required
              />
              {errors.fullName && <span id="err-fullname" className="error-message">{errors.fullName}</span>}
            </div>

            {/* Email Address */}
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'err-email' : undefined}
                required
              />
              {errors.email && <span id="err-email" className="error-message">{errors.email}</span>}
            </div>

            {/* Shipping Address */}
            <div className="form-group">
              <label htmlFor="address">Delivery Address</label>
              <input
                id="address"
                type="text"
                className="form-input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                aria-invalid={!!errors.address}
                aria-describedby={errors.address ? 'err-address' : undefined}
                required
              />
              {errors.address && <span id="err-address" className="error-message">{errors.address}</span>}
            </div>

            {/* City & ZIP */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  type="text"
                  className="form-input"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  aria-invalid={!!errors.city}
                  aria-describedby={errors.city ? 'err-city' : undefined}
                  required
                />
                {errors.city && <span id="err-city" className="error-message">{errors.city}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="zipcode">ZIP Code</label>
                <input
                  id="zipcode"
                  type="text"
                  className="form-input"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  aria-invalid={!!errors.zipCode}
                  aria-describedby={errors.zipCode ? 'err-zipcode' : undefined}
                  placeholder="e.g. 90210"
                  required
                />
                {errors.zipCode && <span id="err-zipcode" className="error-message">{errors.zipCode}</span>}
              </div>
            </div>

            <h3 style={{ borderBottom: '1px solid hsl(var(--border))', paddingBottom: '8px', marginTop: '16px' }}>Payment Information</h3>

            {/* Card Number */}
            <div className="form-group">
              <label htmlFor="cardnumber">Credit Card Number</label>
              <input
                id="cardnumber"
                type="text"
                className="form-input"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="16-digit card number"
                aria-invalid={!!errors.cardNumber}
                aria-describedby={errors.cardNumber ? 'err-cardnumber' : undefined}
                required
              />
              {errors.cardNumber && <span id="err-cardnumber" className="error-message">{errors.cardNumber}</span>}
            </div>

            {/* Expiry & CVV */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="expiry">Expiration Date</label>
                <input
                  id="expiry"
                  type="text"
                  className="form-input"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  placeholder="MM/YY"
                  aria-invalid={!!errors.expiryDate}
                  aria-describedby={errors.expiryDate ? 'err-expiry' : undefined}
                  required
                />
                {errors.expiryDate && <span id="err-expiry" className="error-message">{errors.expiryDate}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="cvv">CVV</label>
                <input
                  id="cvv"
                  type="password"
                  maxLength="4"
                  className="form-input"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  placeholder="3-4 digits"
                  aria-invalid={!!errors.cvv}
                  aria-describedby={errors.cvv ? 'err-cvv' : undefined}
                  required
                />
                {errors.cvv && <span id="err-cvv" className="error-message">{errors.cvv}</span>}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn"
              disabled={submitting}
              style={{ width: '100%', padding: '14px', marginTop: '16px' }}
            >
              {submitting ? 'Verifying order...' : `Pay $${total.toFixed(2)}`}
            </button>
          </form>
        </section>

        {/* Right Side: Order Summary Panel */}
        <aside aria-label="Review cart items">
          <div className="summary-card">
            <h2>Items Review</h2>
            
            <div className="checkout-summary-list">
              {summaryItems.map((item) => (
                <div key={item.id} className="checkout-summary-item">
                  <span>{item.name} <span style={{ color: 'hsl(var(--text-muted))' }}>x{item.quantity}</span></span>
                  <span style={{ fontWeight: 600 }}>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid hsl(var(--border))', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="summary-row total" style={{ border: 'none', padding: 0 }}>
                <span>Grand Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Success Focus-Trapped Dialog receipt Modal */}
      <KeyboardTrapModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        title="Purchase Complete!"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <CheckCircle2 size={64} className="modal-icon-success" aria-hidden="true" />
          <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>
            {receipt?.message || 'Thank you for your order!'}
          </p>
          <div style={{ backgroundColor: 'hsl(var(--bg-app))', padding: '16px', borderRadius: '8px', textAlign: 'left', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div><strong>Order ID:</strong> {receipt?.orderId}</div>
            <div><strong>Subtotal:</strong> ${receipt?.summary?.subtotal.toFixed(2)}</div>
            <div><strong>Tax:</strong> ${receipt?.summary?.tax.toFixed(2)}</div>
            <div><strong>Shipping:</strong> {receipt?.summary?.shipping === 0 ? 'FREE' : `$${receipt?.summary?.shipping.toFixed(2)}`}</div>
            <div style={{ borderTop: '1px solid hsl(var(--border))', paddingTop: '8px', marginTop: '4px' }}>
              <strong>Grand Total Paid:</strong> ${receipt?.summary?.total.toFixed(2)}
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))' }}>
            A confirmation receipt has been sent to <strong>{email}</strong>.
          </p>
          <button type="button" className="btn" onClick={handleModalClose} style={{ marginTop: '8px' }}>
            Continue Shopping
          </button>
        </div>
      </KeyboardTrapModal>
    </main>
  );
};
export default CheckoutPage;
