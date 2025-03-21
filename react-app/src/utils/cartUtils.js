/**
 * Utility functions for cart operations
 */

/**
 * Helper function for API requests with credentials
 */
export const fetchWithCredentials = async (url, options = {}) => {
  const defaultOptions = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  };
  
  // Special handling for DELETE requests which may not be directly supported
  if (options.method === 'DELETE') {
    // Try three different approaches for DELETE requests:
    
    // 1. First attempt with explicit DELETE method and X-HTTP-Method-Override header
    try {
      const deleteOptions = {
        ...defaultOptions,
        ...options,
        headers: {
          ...defaultOptions.headers,
          ...options.headers,
          'X-HTTP-Method-Override': 'DELETE'
        }
      };
      const response = await fetch(url, deleteOptions);
      if (response.ok) {
        return response;
      }
    } catch (error) {
      console.log('DELETE with X-HTTP-Method-Override failed, trying alternative approach');
    }
    
    // 2. Second attempt with POST method and X-HTTP-Method-Override header
    try {
      const postOverrideOptions = {
        ...defaultOptions,
        ...options,
        method: 'POST',
        headers: {
          ...defaultOptions.headers,
          ...options.headers,
          'X-HTTP-Method-Override': 'DELETE'
        }
      };
      const response = await fetch(url, postOverrideOptions);
      if (response.ok) {
        return response;
      }
    } catch (error) {
      console.log('POST with X-HTTP-Method-Override failed, trying URL parameter');
    }
    
    // 3. Third attempt with DELETE method and _method URL parameter
    const urlWithMethod = url.includes('?') 
      ? `${url}&_method=DELETE` 
      : `${url}?_method=DELETE`;
    return fetch(urlWithMethod, {
      ...defaultOptions,
      ...options
    });
  }
  
  // Normal handling for non-DELETE requests
  return fetch(url, { ...defaultOptions, ...options });
};

/**
 * Add an item to the cart
 * @param {number} productId - The ID of the product to add
 * @param {number} quantity - The quantity to add (default: 1)
 * @param {Object} attributes - Any additional attributes for the product
 * @returns {Promise<Object>} The response from the server
 */
export const addToCart = async (productId, quantity = 1, attributes = {}) => {
  try {
    const payload = {
      purchased_entity_type: 'commerce_product_variation',
      purchased_entity_id: productId,
      quantity: quantity,
      ...attributes
    };

    // Using CartAddResource REST endpoint
    const response = await fetchWithCredentials('https://chic-nest.lndo.site/cart/add', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error('Failed to add item to cart');
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding item to cart:', error);
    throw error;
  }
};

/**
 * Get the current cart data
 * @returns {Promise<Object>} The cart data
 */
export const getCartData = async () => {
  try {
    // Use the specified endpoint for cart data
    const response = await fetchWithCredentials('https://chic-nest.lndo.site/api/cart/1');
    
    if (!response.ok) {
      throw new Error('Failed to fetch cart data');
    }
    
    const data = await response.json();
    
    if (!data || data.length === 0) {
      return { items: [], total: { formatted: '$0.00' } };
    }
    
    // Return the data directly since we're using the specified endpoint
    return data;
  } catch (error) {
    console.error('Error getting cart data:', error);
    throw error;
  }
};

/**
 * Update the quantities of items in the cart
 * @param {string} cartId - The ID of the cart
 * @param {Array} items - Array of items with order_item_id and quantity
 * @returns {Promise<Object>} The response from the server
 */
export const updateCartItems = async (cartId, items) => {
  try {
    // Using CartUpdateItemsResource REST endpoint
    const payload = {};
    
    // Format payload for the commerce_cart_api REST resource
    items.forEach(item => {
      payload[item.order_item_id] = {
        quantity: item.quantity
      };
    });
    
    const response = await fetchWithCredentials(`https://chic-nest.lndo.site/cart/${cartId}/items`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update cart items');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating cart items:', error);
    throw error;
  }
};

/**
 * Remove an item from the cart
 * @param {string} cartId - The ID of the cart
 * @param {string} itemId - The ID of the item to remove
 * @returns {Promise<Object>} The response from the server
 */
export const removeCartItem = async (cartId, itemId) => {
  try {
    console.log('Removing from cart:', cartId);
    console.log('Removing item:', itemId);

    // Using CartRemoveItemResource REST endpoint with DELETE method
    // Add the X-HTTP-Method-Override header to ensure the request is treated as DELETE
    const response = await fetchWithCredentials(`https://chic-nest.lndo.site/cart/${cartId}/items/${itemId}`, {
      method: 'DELETE',
      headers: {
        'X-HTTP-Method-Override': 'DELETE'
      }
    });
    console.log('Response:', response);
    
    if (!response.ok) {
      throw new Error('Failed to remove item from cart');
    }
    
    // For successful deletion (204 status), return an empty object
    if (response.status === 204) {
      return {};
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error removing cart item:', error);
    throw error;
  }
};

/**
 * Clear all items from the cart
 * @param {string} cartId - The ID of the cart
 * @returns {Promise<Object>} The response from the server
 */
export const clearCart = async (cartId) => {
  try {
    // Using CartClearResource REST endpoint with DELETE method
    // Add the X-HTTP-Method-Override header to ensure the request is treated as DELETE
    const response = await fetchWithCredentials(`https://chic-nest.lndo.site/cart/${cartId}/items`, {
      method: 'DELETE',
      headers: {
        'X-HTTP-Method-Override': 'DELETE'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to clear cart');
    }
    
    // For successful deletion (204 status), return an empty object
    if (response.status === 204) {
      return {};
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
}; 