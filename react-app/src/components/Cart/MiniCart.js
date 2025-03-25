import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './MiniCart.css';

const MiniCart = () => {
  const { cart, loading, getCartCount } = useCart();
  const cartCount = getCartCount();

  return (
    <div className="mini-cart">
      <Link to="/cart" className="mini-cart-link">
        <div className="cart-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          {!loading && cartCount > 0 && (
            <span className="cart-badge">{cartCount}</span>
          )}
        </div>
        <span className="mini-cart-text">CART ({cartCount})</span>
      </Link>
      
      {!loading && cart && cart.items && cart.items.length > 0 && (
        <div className="mini-cart-preview">
          <div className="mini-cart-header">
            <span>{cart.items.length} items in cart</span>
          </div>
          <ul className="mini-cart-items">
            {cart.items.slice(0, 3).map(item => (
              <li key={item.id} className="mini-cart-item">
                <div className="mini-cart-item-title">{item.title}</div>
                <div className="mini-cart-item-quantity">Qty: {item.quantity}</div>
                <div className="mini-cart-item-price">${parseFloat(item.unit_price).toFixed(2)}</div>
              </li>
            ))}
            {cart.items.length > 3 && (
              <li className="mini-cart-more">
                and {cart.items.length - 3} more item(s)
              </li>
            )}
          </ul>
          <div className="mini-cart-footer">
            <div className="mini-cart-total">
              <span>Total:</span>
              <span>${parseFloat(cart.total).toFixed(2)}</span>
            </div>
            <Link to="/cart" className="view-cart-btn">
              View Cart
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default MiniCart; 