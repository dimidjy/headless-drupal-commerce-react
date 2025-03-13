import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const CartPage = () => {
  const navigate = useNavigate();
  
  // For now, we'll use static data for the cart
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      title: 'Modern Sofa',
      price: 899.99,
      image: '/images/products/sofa.jpg',
      quantity: 1
    },
    {
      id: 3,
      title: 'Accent Chair',
      price: 349.99,
      image: '/images/products/chair.jpg',
      quantity: 2
    }
  ]);

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.08; // 8% tax rate
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="page-title">Your Shopping Cart</h1>
        
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is empty.</p>
            <Link to="/products" className="btn">Continue Shopping</Link>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map(item => (
                    <tr key={item.id}>
                      <td className="product-cell">
                        <div className="product-info">
                          <img src={item.image} alt={item.title} />
                          <span>{item.title}</span>
                        </div>
                      </td>
                      <td>${item.price.toFixed(2)}</td>
                      <td>
                        <div className="quantity-controls">
                          <button 
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>
                            +
                          </button>
                        </div>
                      </td>
                      <td>${(item.price * item.quantity).toFixed(2)}</td>
                      <td>
                        <button 
                          className="remove-btn"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="cart-summary">
              <h2>Order Summary</h2>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Tax (8%)</span>
                <span>${calculateTax().toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
              <button className="btn checkout-btn" onClick={handleCheckout}>
                Proceed to Checkout
              </button>
              <Link to="/products" className="continue-shopping">
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage; 