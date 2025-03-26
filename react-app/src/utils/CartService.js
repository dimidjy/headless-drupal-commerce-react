import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from './config';

/**
 * CartService to handle all cart-related API requests
 * Handles the Commerce-Cart-Token header for all requests
 */
class CartService {
  constructor() {
    this.baseUrl = API_BASE_URL;
    this.api = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // Include cookies for session authentication
    });
    
    // Initialize cart token from localStorage if available
    this.cartToken = localStorage.getItem('commerceCartToken');
    if (!this.cartToken) {
      this.generateCartToken();
    }
    
    console.log('CartService initialized with token:', this.cartToken);
    
    // Add request interceptor to inject cart token header
    this.api.interceptors.request.use(config => {
      if (this.cartToken) {
        config.headers['Commerce-Cart-Token'] = this.cartToken;
        console.log('Adding cart token to request header:', this.cartToken);
      }
      return config;
    });
    
    // Add response interceptor to store cart token from response headers
    this.api.interceptors.response.use(response => {
      const cartToken = response.headers['commerce-cart-token'];
      if (cartToken) {
        console.log('Received cart token in response header:', cartToken);
        this.cartToken = cartToken;
        localStorage.setItem('commerceCartToken', cartToken);
      }
      return response;
    }, error => {
      // Log error details for debugging
      console.error('Cart API Error:', error.response?.data || error.message);
      return Promise.reject(error);
    });
  }

  /**
   * Helper function for API requests with credentials
   * @param {string} url - The endpoint URL
   * @param {Object} options - Request options
   * @returns {Promise} Promise object representing the fetch response
   */
  async fetchWithCredentials(url, options = {}) {
    // Use the cart token from the service
    const cartToken = this.cartToken || '';
    console.log('fetchWithCredentials cartToken', cartToken);
    const defaultOptions = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Commerce-Cart-Token': cartToken, // Include token in headers
        ...options.headers
      }
    };
    
    // Make sure the URL is absolute
    const absoluteUrl = url.startsWith('http') ? url : `${this.baseUrl}${url}`;
    
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
        const response = await fetch(absoluteUrl, deleteOptions);
        if (response.ok) {
          return response;
        }
      } catch (error) {
        // Silent failure, moving to next approach
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
        const response = await fetch(absoluteUrl, postOverrideOptions);
        if (response.ok) {
          return response;
        }
      } catch (error) {
        // Silent failure, moving to next approach
      }
      
      // 3. Third attempt with DELETE method and _method URL parameter
      const urlWithMethod = absoluteUrl.includes('?') 
        ? `${absoluteUrl}&_method=DELETE` 
        : `${absoluteUrl}?_method=DELETE`;
      return fetch(urlWithMethod, {
        ...defaultOptions,
        ...options
      });
    }
    
    // Normal handling for non-DELETE requests
    return fetch(absoluteUrl, { ...defaultOptions, ...options });
  }

  /**
   * Generate and store a new cart token
   * @returns {string} The new cart token
   */
  generateCartToken() {
    this.cartToken = `cart_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem('commerceCartToken', this.cartToken);
    return this.cartToken;
  }

  /**
   * Get the cart token
   * @returns {string} The cart token
   */
  getCartToken() {
    return this.cartToken;
  }

  /**
   * Get current cart contents
   * @returns {Promise} Promise object representing the cart data
   */
  async getCart() {
    try {
      console.log('Getting cart with token:', this.cartToken);
      
      // Use the specified endpoint for cart data
      const response = await this.fetchWithCredentials(`${API_ENDPOINTS.CART.BASE}?_format=json`);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to fetch cart data, server response:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        
        // If we get a 404 or other status, which might be normal for a new cart
        if (response.status === 404) {
          console.log('Cart not found (404), creating an empty cart');
          return { data: { items: [], total: { formatted: '$0.00' } } };
        }
        
        throw new Error(`Failed to fetch cart data: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('getCart data:', data);
      
      if (!data || data.length === 0) {
        console.log('Empty cart data returned');
        return { data: { items: [], total: { formatted: '$0.00' } } };
      }
      
      return { data };
    } catch (error) {
      console.error('Error in getCart:', error);
      throw error;
    }
  }

  /**
   * Add item to cart
   * @param {number} productId - The product ID to add
   * @param {number} quantity - Quantity to add
   * @param {Object} attributes - Optional product attributes
   * @returns {Promise} Promise object representing the update cart
   */
  async addToCart(productId, quantity = 1, attributes = {}) {
    try {
      // Ensure we have a cart token
      if (!this.cartToken) {
        this.generateCartToken();
      }
      
      console.log(`Adding product ${productId} to cart with quantity ${quantity} and token ${this.cartToken}`);
      
      const payload = [
        {
          purchased_entity_type: 'commerce_product_variation',
          purchased_entity_id: productId,
          quantity: quantity,
          ...attributes
        }
      ];

      // Using CartAddResource REST endpoint
      const response = await this.fetchWithCredentials(API_ENDPOINTS.CART.ADD, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to add item to cart, server response:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`Failed to add item to cart: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Add to cart response:', result);
      
      // Handle the new response format with order_items and cart object
      if (result && result.cart && result.cart.order_id) {
        // Store the order ID for future use
        localStorage.setItem('commerceCartId', result.cart.order_id);
        
        // Process the order_items to extract necessary data
        const items = result.order_items || [];
        const total = result.cart.total_price || { 
          number: "0.00", 
          currency_code: "USD", 
          formatted: "$0.00" 
        };
        
        // Format the data to match what the rest of the application expects
        const formattedResult = {
          items: items,
          total: {
            number: total.number,
            currency_code: total.currency_code,
            formatted: total.formatted || `$${parseFloat(total.number).toFixed(2)}`
          },
          order_id: result.cart.order_id
        };

        return { data: formattedResult };
      }
      
      // If we don't have the expected format, still return something useful
      return { data: result };
    } catch (error) {
      console.error('Error in addToCart:', error);
      throw error;
    }
  }

  /**
   * Update cart item quantity
   * @param {number} itemId - The cart item ID to update
   * @param {number} quantity - New quantity
   * @returns {Promise} Promise object representing the updated cart
   */
  async updateCartItem(itemId, quantity) {
    try {
      // Get the cart ID from localStorage or use a default
      const cartId = localStorage.getItem('commerceCartId') || '1';
      
      // Format payload for the commerce_cart_api REST resource
      const payload = {};
      payload[itemId] = {
        quantity: quantity
      };
      
      const response = await this.fetchWithCredentials(`/cart/${cartId}/items`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update cart items');
      }
      
      const result = await response.json();
      return { data: result };
    } catch (error) {
      console.error('Error in updateCartItem:', error);
      throw error;
    }
  }

  /**
   * Remove item from cart
   * @param {number} itemId - The cart item ID to remove
   * @returns {Promise} Promise object representing the updated cart
   */
  async removeCartItem(itemId) {
    try {
      // Get the cart ID from localStorage or use a default
      const cartId = localStorage.getItem('commerceCartId') || '1';
      
      // Using CartRemoveItemResource REST endpoint with DELETE method
      const response = await this.fetchWithCredentials(`/cart/${cartId}/items/${itemId}`, {
        method: 'DELETE',
        headers: {
          'X-HTTP-Method-Override': 'DELETE'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove item from cart');
      }
      
      // Get updated cart data
      const updatedCartResponse = await this.getCart();
      return updatedCartResponse;
    } catch (error) {
      console.error('Error in removeCartItem:', error);
      throw error;
    }
  }

  /**
   * Clear the entire cart
   * @returns {Promise} Promise object representing the empty cart
   */
  async clearCart() {
    try {
      // Get the cart ID from localStorage or use a default
      const cartId = localStorage.getItem('commerceCartId') || '1';
      
      // Using CartClearResource REST endpoint with DELETE method
      const response = await this.fetchWithCredentials(`/cart/${cartId}/items`, {
        method: 'DELETE',
        headers: {
          'X-HTTP-Method-Override': 'DELETE'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to clear cart');
      }
      
      // Return an empty cart after clearing
      return { data: { items: [], total: { formatted: '$0.00' } } };
    } catch (error) {
      console.error('Error in clearCart:', error);
      throw error;
    }
  }

  /**
   * Proceed to checkout
   * @returns {Promise} Promise object representing the checkout data
   */
  async checkout() {
    try {
      // Get current cart data to use in the checkout page
      const cartResponse = await this.getCart();
      
      return { 
        data: { 
          cart: cartResponse.data,
          // Still including redirect_url for backward compatibility
          redirect_url: '/checkout'
        } 
      };
    } catch (error) {
      console.error('Error in checkout:', error);
      throw error;
    }
  }
  
  /**
   * Clear the cart token from storage and memory
   */
  clearCartToken() {
    this.cartToken = null;
    localStorage.removeItem('commerceCartToken');
  }
}

export default new CartService(); 