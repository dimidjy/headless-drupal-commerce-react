import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-column brand-column">
            <h3 className="footer-title">CHICNEST</h3>
            <p>Home goods demo store: content and catalogue are managed in Drupal Commerce and rendered by this React app.</p>
            <div className="social-icons">
              <a href="https://www.facebook.com/" aria-label="Facebook" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a>
              <a href="https://x.com/" aria-label="Twitter" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
              <a href="https://www.youtube.com/" aria-label="YouTube" target="_blank" rel="noopener noreferrer"><i className="fab fa-youtube"></i></a>
              <a href="https://www.pinterest.com/" aria-label="Pinterest" target="_blank" rel="noopener noreferrer"><i className="fab fa-pinterest"></i></a>
              <a href="https://www.instagram.com/" aria-label="Instagram" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
            </div>
          </div>
          
          <div className="footer-column">
            <h3 className="footer-title">QUICK LINKS</h3>
            <ul className="footer-links">
              <li><Link to="/">HOME</Link></li>
              <li><Link to="/about">ABOUT</Link></li>
              <li><Link to="/services">SERVICES</Link></li>
              <li><Link to="/single-item">SINGLE ITEM</Link></li>
              <li><Link to="/contact">CONTACT</Link></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h3 className="footer-title">HELP & INFO</h3>
            <ul className="footer-links">
              <li><Link to="/track-order">TRACK YOUR ORDER</Link></li>
              <li><Link to="/returns">RETURNS + EXCHANGES</Link></li>
              <li><Link to="/shipping">SHIPPING + DELIVERY</Link></li>
              <li><Link to="/contact">CONTACT US</Link></li>
              <li><Link to="/find-us">FIND US EASY</Link></li>
              <li><Link to="/faqs">FAQS</Link></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h3 className="footer-title">CONTACT US</h3>
            <p>Do you have any questions or suggestions?</p>
            <p className="contact-email">contact@chicnest.com</p>
            <p>Do you need support? Give us a call.</p>
            <p className="contact-phone">+43 720 11 52 78</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="payment-shipping">
            <div className="shipping-info">
              <span>We ship with:</span>
              <img src="/images/shipping-dhl.svg" alt="DHL" className="shipping-icon" />
              <img src="/images/shipping-fedex.svg" alt="FedEx" className="shipping-icon" />
            </div>
            <div className="payment-info">
              <span>Payment Option:</span>
              <img src="/images/payment-visa.svg" alt="Visa" className="payment-icon" />
              <img src="/images/payment-paypal.svg" alt="PayPal" className="payment-icon" />
              <img src="/images/payment-mastercard.svg" alt="Mastercard" className="payment-icon" />
            </div>
          </div>
          <div className="copyright">
            <p>&copy; Copyright {new Date().getFullYear()} ChicNest. All rights reserved. Design by <a href="https://templatesjungle.com/" className="designer-link" target="_blank" rel="noopener noreferrer">TemplatesJungle</a></p>
            <p>Distribution By <a href="https://themewagon.com/" className="distributor-link" target="_blank" rel="noopener noreferrer">ThemeWagon</a></p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 