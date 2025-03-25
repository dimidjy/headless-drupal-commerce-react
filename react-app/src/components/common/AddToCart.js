import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import './AddToCart.css';

/**
 * AddToCart component for adding products to the cart
 * @param {Object} props
 * @param {number} props.productId - The ID of the product to add
 * @param {boolean} props.inStock - Whether the product is in stock
 * @param {function} props.onSuccess - Callback function called after successful addition
 * @param {function} props.onError - Callback function called if there's an error
 */
const AddToCart = ({ productId, inStock = true, onSuccess, onError }) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const { addToCart } = useCart();

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setQuantity(value > 0 ? value : 1);
  };

  const handleAddToCart = async () => {
    if (!inStock) {
      setMessage({ type: 'error', text: 'Sorry, this product is out of stock.' });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);
      
      await addToCart(productId, quantity);
      
      setMessage({ type: 'success', text: 'Item added to your cart!' });
      
      if (onSuccess) {
        onSuccess(productId, quantity);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to add item to cart. Please try again.' });
      console.error('Add to cart error:', error);
      
      if (onError) {
        onError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-to-cart">
      <div className="quantity-control">
        <label htmlFor="quantity">Quantity:</label>
        <input
          type="number"
          id="quantity"
          name="quantity"
          value={quantity}
          onChange={handleQuantityChange}
          min="1"
          disabled={loading || !inStock}
        />
      </div>
      
      <button 
        className={`add-to-cart-button ${!inStock ? 'disabled' : ''}`}
        onClick={handleAddToCart}
        disabled={loading || !inStock}
      >
        {loading ? 'Adding...' : inStock ? 'Add to Cart' : 'Out of Stock'}
      </button>
      
      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
    </div>
  );
};

export default AddToCart; 