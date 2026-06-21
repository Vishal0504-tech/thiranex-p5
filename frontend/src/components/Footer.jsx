import React from 'react';
import { Link } from 'react-router-dom';
import { Laptop } from 'lucide-react';

export const Footer = () => {
  return (
    <footer role="contentinfo">
      <div className="footer-container">
        {/* Brand Info */}
        <div className="footer-col">
          <Link to="/" className="logo" style={{ marginBottom: '16px', display: 'inline-flex' }} aria-label="AuraShop Home">
            <Laptop aria-hidden="true" size={24} />
            <span style={{ fontSize: '1.25rem' }}>AURA</span>
          </Link>
          <p>
            Crafting state-of-the-art products and premium lifestyle tech accessories. Experience visual excellence and tactile perfection.
          </p>
        </div>

        {/* Categories Quick Links */}
        <div className="footer-col">
          <h3>Categories</h3>
          <ul>
            <li><Link to="/">Audio Devices</Link></li>
            <li><Link to="/">Mechanical Keyboards</Link></li>
            <li><Link to="/">Desk Lighting</Link></li>
            <li><Link to="/">Tech Accessories</Link></li>
          </ul>
        </div>

        {/* A11y Statement */}
        <div className="footer-col">
          <h3>Accessibility Pledge</h3>
          <p>
            We are dedicated to digital accessibility. This catalog conforms strictly to W3C Web Content Accessibility Guidelines (WCAG) 2.1 Level AA specifications to ensure high compatibility with assistive technologies.
          </p>
        </div>

        {/* Contact/Support */}
        <div className="footer-col">
          <h3>Customer Support</h3>
          <p>Email: support@aura-lifestyle.com</p>
          <p>Phone: +1 (555) AURA-TECH</p>
        </div>
      </div>

      <div className="footer-bottom">
        <span>&copy; {new Date().getFullYear()} AURA Inc. All rights reserved.</span>
        <span>Made with ❤️ for premium visual and auditory creators.</span>
      </div>
    </footer>
  );
};
export default Footer;
