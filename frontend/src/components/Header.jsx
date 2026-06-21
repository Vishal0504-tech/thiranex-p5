import React, { useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ShoppingCart, Heart, Sun, Moon, Search, Laptop } from 'lucide-react';

export const Header = () => {
  const {
    cart,
    wishlist,
    theme,
    toggleTheme,
    searchQuery,
    setSearchQuery
  } = useApp();

  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef(null);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlist.length;

  // If user starts typing from a different route, auto-navigate to Catalog Home
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  // Keyboard shortcut: Press Ctrl+k or / to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore shortcut if user is focused inside an input field, textarea, select, or contenteditable element
      const activeEl = document.activeElement;
      if (activeEl) {
        const tagName = activeEl.tagName;
        if (
          tagName === 'INPUT' ||
          tagName === 'TEXTAREA' ||
          tagName === 'SELECT' ||
          activeEl.isContentEditable
        ) {
          return;
        }
      }

      if ((e.ctrlKey && e.key === 'k') || e.key === '/') {
        if (document.activeElement !== searchInputRef.current) {
          e.preventDefault();
          searchInputRef.current?.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header role="banner">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="logo" aria-label="AuraShop Home">
          <Laptop aria-hidden="true" size={28} />
          <span>AURA</span>
        </Link>

        {/* Navigation Links */}
        <nav aria-label="Main Navigation">
          <ul className="nav-links">
            <li>
              <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
                Catalog
              </NavLink>
            </li>
            <li>
              <NavLink to="/wishlist" className={({ isActive }) => isActive ? 'active' : ''}>
                Wishlist
              </NavLink>
            </li>
            <li>
              <NavLink to="/cart" className={({ isActive }) => isActive ? 'active' : ''}>
                Cart
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Search Bar Form */}
        <form className="header-actions" onSubmit={handleSearchSubmit} role="search">
          <div className="search-container">
            <span className="search-icon" aria-hidden="true">
              <Search size={18} />
            </span>
            <input
              ref={searchInputRef}
              type="search"
              className="search-input"
              placeholder="Search catalog... (press '/' to focus)"
              value={searchQuery}
              onChange={handleSearchChange}
              aria-label="Search products"
            />
          </div>

          {/* Theme Toggle Button */}
          <button
            type="button"
            className="icon-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          >
            {theme === 'light' ? <Moon size={20} aria-hidden="true" /> : <Sun size={20} aria-hidden="true" />}
          </button>

          {/* Wishlist Link */}
          <Link
            to="/wishlist"
            className="icon-btn"
            aria-label={`View Wishlist. ${wishlistCount} ${wishlistCount === 1 ? 'item' : 'items'}`}
          >
            <Heart size={20} aria-hidden="true" />
            {wishlistCount > 0 && (
              <span className="badge" aria-hidden="true">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Link */}
          <Link
            to="/cart"
            className="icon-btn"
            aria-label={`View Shopping Cart. ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`}
          >
            <ShoppingCart size={20} aria-hidden="true" />
            {cartCount > 0 && (
              <span className="badge" aria-hidden="true">
                {cartCount}
              </span>
            )}
          </Link>
        </form>
      </div>
    </header>
  );
};
export default Header;
