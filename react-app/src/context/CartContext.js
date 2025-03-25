import React, { createContext, useState, useEffect, useContext } from 'react';
import cartService from '../utils/CartService';

// Creating the Cart Context
const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load cart data when component mounts
  useEffect(() => {
    fetchCart();
  }, []);

  // Fetch cart data from the API
  const fetchCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await cartService.getCart();
      console.log('response', response);
      
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        // New structure: array of orders with nested order_items
        const order = response.data[0]; // Take the first order
        
        const transformedData = {
          order_id: order.order_id,
          uuid: order.uuid,
          items: order.order_items.map(item => ({
            id: item.order_item_id,
            uuid: item.uuid,
            title: item.title,
            quantity: parseFloat(item.quantity),
            unit_price: parseFloat(item.unit_price.number),
            unit_price_formatted: item.unit_price.formatted,
            total: parseFloat(item.total_price.number),
            total_formatted: item.total_price.formatted,
            currency_code: item.unit_price.currency_code,
            // Extract image from purchased_entity if available
            image: item.purchased_entity?.field_product_image || 'placeholder-image',
            purchased_entity: item.purchased_entity || {}
          })),
          total: parseFloat(order.total_price.number),
          total_formatted: order.total_price.formatted,
          currency_code: order.total_price.currency_code,
          order_total: order.order_total || {}
        };
        setCart(transformedData);
      } else if (response.data && typeof response.data === 'object') {
        // It's already in our expected format
        setCart(response.data);
      } else {
        // Empty or invalid response, set empty cart
        setCart({ 
          order_id: null,
          uuid: null,
          items: [], 
          total: 0,
          total_formatted: '$0.00',
          currency_code: 'USD',
          order_total: {
            subtotal: { number: '0.00', currency_code: 'USD', formatted: '$0.00' },
            total: { number: '0.00', currency_code: 'USD', formatted: '$0.00' }
          }
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch cart');
      // If we get a 404, it means no cart exists yet, which is fine
      if (err.response?.status === 404) {
        setCart({ 
          order_id: null,
          uuid: null,
          items: [], 
          total: 0,
          total_formatted: '$0.00',
          currency_code: 'USD',
          order_total: {
            subtotal: { number: '0.00', currency_code: 'USD', formatted: '$0.00' },
            total: { number: '0.00', currency_code: 'USD', formatted: '$0.00' }
          }
        });
        setError(null);
      }
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (productId, quantity = 1, attributes = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await cartService.addToCart(productId, quantity, attributes);
      // After adding item, refresh the cart
      await fetchCart();
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add item to cart');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update cart item quantity
  const updateCartItem = async (itemId, quantity) => {
    setLoading(true);
    setError(null);
    try {
      const response = await cartService.updateCartItem(itemId, quantity);
      // After updating item, refresh the cart
      await fetchCart();
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update cart item');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeCartItem = async (itemId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await cartService.removeCartItem(itemId);
      // After removing item, refresh the cart
      await fetchCart();
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove item from cart');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await cartService.clearCart();
      setCart({ items: [], total: 0 });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to clear cart');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Proceed to checkout
  const checkout = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await cartService.checkout();
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to proceed to checkout');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get cart token
  const getCartToken = () => {
    return cartService.getCartToken();
  };

  // Get cart count (total number of items)
  const getCartCount = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + (parseFloat(item.quantity) || 0), 0);
  };

  return (
    <CartContext.Provider 
      value={{
        cart,
        loading,
        error,
        addToCart,
        updateCartItem,
        removeCartItem,
        clearCart,
        checkout,
        getCartToken,
        getCartCount,
        refreshCart: fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === null) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext; 