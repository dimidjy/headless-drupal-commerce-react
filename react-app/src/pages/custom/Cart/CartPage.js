import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CartPage.css';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        // Using the specified API endpoint with static ID of 1
        const response = await fetch('https://chic-nest.lndo.site/api/cart/1');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch cart data: ${response.status}`);
        }
        
        const data = await response.json();
        setCartItems(data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };
    
    fetchCartData();
  }, []);
  
  const handleUpdateCart = () => {
    // This would be implemented to update cart quantities
    alert('Cart update functionality would be implemented here');
  };
  
  const handleRemoveItem = (itemId) => {
    // This would be implemented to remove items from the cart
    alert(`Remove item ${itemId} functionality would be implemented here`);
  };
  
  const handleCheckout = () => {
    // This would redirect to checkout page
    alert('Checkout functionality would be implemented here');
  };
  
  // Calculate subtotal and total based on cart items
  const calculateSubtotal = () => {
    if (!cartItems.length) return '$0.00';
    
    // Sum up the total prices
    return cartItems.reduce((total, item) => {
      // Remove $ sign and convert to number
      const price = parseFloat(item.total_price.replace('$', ''));
      return total + price;
    }, 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };
  
  if (isLoading) {
    return (
      <div className="cart-container">
        <h1 className="cart-title">Shopping cart</h1>
        <div className="cart-loading">Loading cart data...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="cart-container">
        <h1 className="cart-title">Shopping cart</h1>
        <div className="cart-error">Error loading cart: {error}</div>
      </div>
    );
  }
  
  return (
    <div className="cart-container">
      <h1 className="cart-title">Shopping cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <p>Your cart is empty.</p>
          <Link to="/" className="btn">Continue Shopping</Link>
        </div>
      ) : (
        <>
          <div className="cart-table">
            <div className="cart-header">
              <div className="cart-cell cart-header-item">Item</div>
              <div className="cart-cell cart-header-price">Price</div>
              <div className="cart-cell cart-header-quantity">Quantity</div>
              <div className="cart-cell cart-header-remove">Remove</div>
              <div className="cart-cell cart-header-total">Total</div>
            </div>
            
            {cartItems.map((item) => (
              <div key={item.id} className="cart-row">
                <div className="cart-cell cart-item-name">
                  <Link to={`/product/${item.id}`}>
                    Closes
                  </Link>
                </div>
                <div className="cart-cell cart-item-price">
                  {item.price}
                </div>
                <div className="cart-cell cart-item-quantity">
                  <input 
                    type="number" 
                    className="quantity-input"
                    defaultValue={parseFloat(item.quantity)} 
                    min="1"
                  />
                </div>
                <div className="cart-cell cart-item-remove">
                  <button 
                    className="remove-button"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
                <div className="cart-cell cart-item-total">
                  {item.total_price}
                </div>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <div className="cart-subtotal">
              <span>Subtotal</span>
              <span>{calculateSubtotal()}</span>
            </div>
            <div className="cart-total">
              <span>Total</span>
              <span>{calculateSubtotal()}</span>
            </div>
          </div>
          
          <div className="cart-actions">
            <button className="btn update-cart" onClick={handleUpdateCart}>Update cart</button>
            <button className="btn checkout" onClick={handleCheckout}>Checkout</button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage; 