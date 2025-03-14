import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-column">
            <h3 className="footer-title">ChicNest</h3>
            <p>Your premier destination for stylish and comfortable living spaces.</p>
          </div>
          <div className="footer-column">
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3 className="footer-title">Contact</h3>
            <ul className="footer-links">
              <li>123 Design Street</li>
              <li>New York, NY 10001</li>
              <li>Email: info@chicnest.com</li>
              <li>Phone: (123) 456-7890</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} ChicNest. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 