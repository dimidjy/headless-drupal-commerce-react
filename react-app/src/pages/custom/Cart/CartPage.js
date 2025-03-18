import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './CartPage.css';

const CartPage = () => {
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();
  
  // Placeholder cart data
  const placeholderCart = {
    items: [
      {
        id: '1',
        title: 'Sample Product',
        quantity: 1,
        unitPrice: { formatted: '$99.99' },
        totalPrice: { formatted: '$99.99' },
        purchasedEntity: {
          id: '1',
          sku: 'SAMPLE-001',
          images: [{ variations: [{ url: 'https://via.placeholder.com/150' }] }]
        }
      }
    ],
    total: { formatted: '$99.99' }
  };

  const [cartData, setCartData] = useState(placeholderCart);
  
  const handleQuantityChange = (itemId, newQuantity) => {
    setQuantities({
      ...quantities,
      [itemId]: newQuantity
    });
  };
  
  const handleUpdateCart = () => {
    // Placeholder for cart update functionality
    console.log('Cart update will be implemented');
  };
  
  const handleRemoveItem = (itemId) => {
    // Placeholder for remove item functionality
    console.log('Remove item will be implemented');
  };
  
  const handleCheckout = () => {
    navigate('/checkout');
  };
  
  const calculateSubtotal = () => {
    return cartData.total;
  };

  const cartItems = cartData.items || [];
  
  return (
    <div className="cart-container">
      <h1 className="cart-title">Shopping cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <p>Your cart is empty.</p>
          <Link to="/products" className="btn">Continue Shopping</Link>
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
                  <div className="cart-item-image">
                    {item.purchasedEntity?.images?.[0]?.variations?.[0]?.url && (
                      <img 
                        src={item.purchasedEntity.images[0].variations[0].url} 
                        alt={item.purchasedEntity.images[0].alt || item.title} 
                      />
                    )}
                  </div>
                  <div className="cart-item-details">
                    <Link to={`/product/${item.purchasedEntity.id}`}>
                      {item.title}
                    </Link>
                    <div className="cart-item-sku">SKU: {item.purchasedEntity.sku}</div>
                  </div>
                </div>
                <div className="cart-cell cart-item-price">
                  {item.unitPrice.formatted}
                </div>
                <div className="cart-cell cart-item-quantity">
                  <input 
                    type="number" 
                    className="quantity-input"
                    value={quantities[item.id] || item.quantity} 
                    onChange={(e) => handleQuantityChange(item.id, e.target.value)}
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
                  {item.totalPrice.formatted}
                </div>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <div className="cart-subtotal">
              <span>Subtotal</span>
              <span>{calculateSubtotal().formatted}</span>
            </div>
            <div className="cart-total">
              <span>Total</span>
              <span>{calculateSubtotal().formatted}</span>
            </div>
          </div>
          
          <div className="cart-actions">
            <button 
              className="btn update-cart" 
              onClick={handleUpdateCart}
            >
              Update cart
            </button>
            <button 
              className="btn checkout" 
              onClick={handleCheckout}
            >
              Proceed to checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage; 