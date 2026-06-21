 
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
// Import Global Layout Widgets
import AccessibilityToolbar from './components/AccessibilityToolbar';
import Header from './components/Header';
import Footer from './components/Footer';

// Import Pages
import CatalogPage from './pages/CatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import CheckoutPage from './pages/CheckoutPage';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        {/* WCAG Accessibility Skip Link */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        {/* Top accessibility bar */}
        <AccessibilityToolbar />

        {/* Global Navigation header */}
        <Header />

        {/* Dynamic Route Pages */}
        <Routes>
          <Route path="/" element={<CatalogPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          {/* Fallback to catalog home */}
          <Route path="*" element={<CatalogPage />} />
        </Routes>

        {/* Semantic footer */}
        <Footer />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
