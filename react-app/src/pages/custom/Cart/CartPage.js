import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_CART, UPDATE_CART_ITEM, REMOVE_CART_ITEM } from '../../../graphql/queries';
import './CartPage.css';

const CartPage = () => {
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();
  
  // Fetch cart data using GraphQL
  const { loading, error, data, refetch } = useQuery(GET_CART, {
    fetchPolicy: 'network-only', // Don't use cache for cart data
    onCompleted: (data) => {
      // Initialize quantities state from fetched data
      if (data?.cart?.items) {
        const initialQuantities = {};
        data.cart.items.forEach(item => {
          initialQuantities[item.id] = item.quantity;
        });
        setQuantities(initialQuantities);
      }
    }
  });

  // Update cart item mutation
  const [updateCartItem, { loading: updateLoading }] = useMutation(UPDATE_CART_ITEM, {
    onCompleted: () => {
      refetch(); // Refresh cart data after update
    }
  });

  // Remove cart item mutation
  const [removeCartItem, { loading: removeLoading }] = useMutation(REMOVE_CART_ITEM, {
    onCompleted: () => {
      refetch(); // Refresh cart data after removal
    }
  });
  
  const handleQuantityChange = (itemId, newQuantity) => {
    setQuantities({
      ...quantities,
      [itemId]: newQuantity
    });
  };
  
  const handleUpdateCart = () => {
    // Process each item that needs updating
    const promises = Object.entries(quantities).map(([itemId, quantity]) => {
      const cartItem = data.cart.items.find(item => item.id === itemId);
      if (cartItem && cartItem.quantity !== quantity) {
        return updateCartItem({
          variables: {
            orderItemId: itemId,
            quantity: parseInt(quantity, 10)
          }
        });
      }
      return Promise.resolve();
    });
    
    Promise.all(promises)
      .then(() => {
        // Show success notification if needed
      })
      .catch(err => {
        console.error('Error updating cart:', err);
      });
  };
  
  const handleRemoveItem = (itemId) => {
    removeCartItem({
      variables: {
        orderItemId: itemId
      }
    }).catch(err => {
      console.error('Error removing item:', err);
    });
  };
  
  const handleCheckout = () => {
    navigate('/checkout');
  };
  
  // Calculate subtotal from cart items
  const calculateSubtotal = () => {
    if (!data?.cart?.items?.length) return { formatted: '$0.00' };
    return data.cart.total;
  };
  
  if (loading) {
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
        <div className="cart-error">Error loading cart: {error.message}</div>
      </div>
    );
  }

  const cartItems = data?.cart?.items || [];
  
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
                    disabled={removeLoading}
                  >
                    {removeLoading ? 'Removing...' : 'Remove'}
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
              disabled={updateLoading}
            >
              {updateLoading ? 'Updating...' : 'Update cart'}
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