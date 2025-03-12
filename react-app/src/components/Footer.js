import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-section">
          <h3>Chic Nest</h3>
          <p>Your one-stop shop for stylish home decor and furniture.</p>
        </div>
        
        <div className="footer-section">
          <h3>Shop</h3>
          <ul className="footer-links">
            <li className="footer-link">
              <Link to="/products">All Products</Link>
            </li>
            <li className="footer-link">
              <Link to="/products?category=furniture">Furniture</Link>
            </li>
            <li className="footer-link">
              <Link to="/products?category=decor">Decor</Link>
            </li>
            <li className="footer-link">
              <Link to="/products?category=lighting">Lighting</Link>
            </li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Customer Service</h3>
          <ul className="footer-links">
            <li className="footer-link">
              <Link to="/contact">Contact Us</Link>
            </li>
            <li className="footer-link">
              <Link to="/shipping">Shipping & Returns</Link>
            </li>
            <li className="footer-link">
              <Link to="/faq">FAQ</Link>
            </li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Connect</h3>
          <ul className="footer-links">
            <li className="footer-link">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
            </li>
            <li className="footer-link">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
            </li>
            <li className="footer-link">
              <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer">Pinterest</a>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="container">
        <div className="copyright">
          &copy; {new Date().getFullYear()} Chic Nest. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer; 