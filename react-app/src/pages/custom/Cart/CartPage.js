import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  getCartData, 
  updateCartItems, 
  removeCartItem, 
  clearCart 
} from '../../../utils/cartUtils';
import './CartPage.css';

const CartPage = () => {
  const [quantities, setQuantities] = useState({});
  const [cartData, setCartData] = useState({ items: [], total: { formatted: '$0.00' } });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartId, setCartId] = useState('1'); // Default cart ID is 1 for the specified endpoint
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchCartData();
  }, []);
  
  const fetchCartData = async () => {
    try {
      setLoading(true);
      
      const data = await getCartData();
      
      if (data && data.length > 0) {
        // Transform API data to match our component structure
        const transformedData = {
          items: data.map(item => ({
            id: item.order_item_id,
            title: item.title,
            quantity: parseFloat(item.quantity),
            unitPrice: { formatted: item.price },
            totalPrice: { formatted: item.total_price },
            productUrl: item.view_commerce_product,
            purchasedEntity: {
              id: item.order_item_id,
              sku: `SKU-${item.order_item_id}`,
              images: [{ variations: [{ url: item.image }] }]
            }
          })),
          total: { 
            formatted: data.reduce((sum, item) => {
              // Extract numeric value from price string and add to sum
              const price = parseFloat(item.total_price.replace(/[^0-9.-]+/g, ''));
              return sum + price;
            }, 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
          }
        };
        
        setCartData(transformedData);
        
        // Initialize quantities state
        const initialQuantities = {};
        transformedData.items.forEach(item => {
          initialQuantities[item.id] = item.quantity;
        });
        setQuantities(initialQuantities);
      } else {
        // Empty cart
        setCartData({ items: [], total: { formatted: '$0.00' } });
      }
      
    } catch (err) {
      setError(err.message);
      console.error('Error fetching cart data:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleQuantityChange = (itemId, newQuantity) => {
    setQuantities({
      ...quantities,
      [itemId]: newQuantity
    });
  };
  
  const handleUpdateCart = async () => {
    if (!cartId) return;
    
    try {
      setLoading(true);
      
      // Prepare items data for update
      const itemsToUpdate = cartData.items.map(item => ({
        order_item_id: item.id,
        quantity: quantities[item.id] || item.quantity
      }));
      
      // Update cart items
      await updateCartItems(cartId, itemsToUpdate);
      
      // Refresh cart data
      await fetchCartData();
      
    } catch (err) {
      setError(err.message);
      console.error('Error updating cart:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleRemoveItem = async (itemId) => {
    if (!cartId) return;
    
    try {
      setLoading(true);
      
      // Remove item from cart
      await removeCartItem(cartId, itemId);
      
      // Refresh cart data
      await fetchCartData();
      
    } catch (err) {
      setError(err.message);
      console.error('Error removing item:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleClearCart = async () => {
    if (!cartId) return;
    
    try {
      setLoading(true);
      
      // Clear the cart
      await clearCart(cartId);
      
      // Refresh cart data
      await fetchCartData();
      
    } catch (err) {
      setError(err.message);
      console.error('Error clearing cart:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCheckout = () => {
    navigate('/checkout');
  };
  
  const calculateSubtotal = () => {
    return cartData.total;
  };

  const cartItems = cartData.items || [];
  if (loading) {
    return <div className="cart-loading">Loading your cart...</div>;
  }
  
  if (error) {
    return <div className="cart-error">Error loading cart: {error}</div>;
  }
  
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
                        alt={item.title} 
                      />
                    )}
                  </div>
                  <div className="cart-item-details">
                    <Link to={item.productUrl || `#`}>
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
                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value, 10))}
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
              className="btn clear-cart" 
              onClick={handleClearCart}
            >
              Clear cart
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