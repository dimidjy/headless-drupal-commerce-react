import React from 'react';
import { Link } from 'react-router-dom';
import Cart from '../../../components/Cart/Cart';
import './CartPage.css';

const CartPage = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Shopping Cart</h1>
        <div className="breadcrumbs">
          <Link to="/">Home</Link> / <span>Cart</span>
        </div>
      </div>
      
      <div className="page-content">
        <Cart />
        
        <div className="cart-continue-shopping">
          <Link to="/products" className="continue-shopping-btn">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage; 