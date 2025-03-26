/**
 * Configuration file for the ChicNest React application
 * Contains centralized configuration values used across the application
 */

// Base URL for all API requests
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://chic-nest.lndo.site';

// API endpoints
export const API_ENDPOINTS = {
  // Cart related endpoints
  CART: {
    BASE: `${API_BASE_URL}/cart`,
    ADD: `${API_BASE_URL}/cart/add`,
  },
  
  // GraphQL endpoint
  GRAPHQL: `${API_BASE_URL}/graphql-default-api`,
  
  // Webform endpoints
  WEBFORM: `${API_BASE_URL}/webform_rest`,
  
  // General API endpoints
  API: `${API_BASE_URL}`,
};

export default API_ENDPOINTS; 