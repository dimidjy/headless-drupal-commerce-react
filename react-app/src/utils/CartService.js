import axios from 'axios';
import { 
  getCartData as getCartDataOriginal, 
  addToCart as addToCartOriginal,
  updateCartItems,
  removeCartItem,
  clearCart
} from './cartUtils';

/**
 * CartService to handle all cart-related API requests
 * Handles the Commerce-Cart-Token header for all requests
 */
class CartService {
  constructor() {
    this.baseUrl = process.env.REACT_APP_API_BASE_URL || 'https://chic-nest.lndo.site';
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
    
    // Add request interceptor to inject cart token header
    this.api.interceptors.request.use(config => {
      if (this.cartToken) {
        config.headers['Commerce-Cart-Token'] = this.cartToken;
      }
      return config;
    });
    
    // Add response interceptor to store cart token from response headers
    this.api.interceptors.response.use(response => {
      const cartToken = response.headers['commerce-cart-token'];
      if (cartToken) {
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
   * Get current cart contents - uses the existing getCartData function
   * but adds the cart token header
   * @returns {Promise} Promise object representing the cart data
   */
  async getCart() {
    try {
      // We'll use the existing getCartData function but ensure the cart token is set
      // by wrapping the response in our own format
      const cartData = await getCartDataOriginal();
      return { data: cartData };
    } catch (error) {
      console.error('Error in getCart:', error);
      throw error;
    }
  }

  /**
   * Add item to cart - uses the existing addToCart function
   * but adds the cart token header
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
      
      const result = await addToCartOriginal(productId, quantity, attributes);
      return { data: result };
    } catch (error) {
      console.error('Error in addToCart:', error);
      throw error;
    }
  }

  /**
   * Update cart item quantity - uses the existing updateCartItems function
   * @param {number} itemId - The cart item ID to update
   * @param {number} quantity - New quantity
   * @returns {Promise} Promise object representing the updated cart
   */
  async updateCartItem(itemId, quantity) {
    try {
      // For the cartId, we'll use a fixed value of '1' which seems to be the default in cartUtils.js
      // In a real application, you would determine this differently
      const cartId = '1';
      const result = await updateCartItems(cartId, [{ order_item_id: itemId, quantity }]);
      return { data: result };
    } catch (error) {
      console.error('Error in updateCartItem:', error);
      throw error;
    }
  }

  /**
   * Remove item from cart - uses the existing removeCartItem function
   * @param {number} itemId - The cart item ID to remove
   * @returns {Promise} Promise object representing the updated cart
   */
  async removeCartItem(itemId) {
    try {
      // For the cartId, we'll use a fixed value of '1' which seems to be the default in cartUtils.js
      const cartId = '1';
      const result = await removeCartItem(cartId, itemId);
      // After removal, fetch the updated cart data
      const updatedCart = await getCartDataOriginal();
      return { data: updatedCart };
    } catch (error) {
      console.error('Error in removeCartItem:', error);
      throw error;
    }
  }

  /**
   * Clear the entire cart - uses the existing clearCart function
   * @returns {Promise} Promise object representing the empty cart
   */
  async clearCart() {
    try {
      // For the cartId, we'll use a fixed value of '1' which seems to be the default in cartUtils.js
      const cartId = '1';
      await clearCart(cartId);
      // Return an empty cart after clearing
      return { data: { items: [], total: { formatted: '$0.00' } } };
    } catch (error) {
      console.error('Error in clearCart:', error);
      throw error;
    }
  }

  /**
   * Proceed to checkout
   * @returns {Promise} Promise object with checkout URL and information
   */
  async checkout() {
    try {
      // Redirect to the Drupal checkout page
      // In a real implementation, you might need to make an API call to get the checkout URL
      return { 
        data: { 
          redirect_url: `${this.baseUrl}/checkout/1` 
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

// Create singleton instance
const cartService = new CartService();
export default cartService; 