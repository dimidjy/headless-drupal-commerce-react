/**
 * Utility functions for page handling
 */
import { API_ENDPOINTS } from './config';

/**
 * Fetches the UUID for a page based on its path
 * 
 * @param {string} path - The current page path
 * @returns {Promise<Object>} - A promise that resolves to the page data
 */
export const fetchPageUuidByPath = async (path) => {
  try {
    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    
    // For the home page (empty path), use root
    const pathParam = cleanPath || 'home';
    
    // Use the absolute URL from config
    const response = await fetch(`${API_ENDPOINTS.API}/path-to-uuid?path=/${pathParam}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch page UUID for path ${path}`);
    }
    
    const data = await response.json();
    
    // Check for error in response
    if (data.error) {
      throw new Error(data.error);
    }
    
    // Return the full response data to handle different entity types
    return {
      uuid: data.uuid,
      type: data.type || 'node',
      title: data.title,
      product_id: data.product_id,
      bundle: data.bundle,
    };
  } catch (error) {
    console.error('Error fetching page UUID:', error);
    throw error;
  }
};

/**
 * Get the UUID for a specific route if available
 * 
 * @param {Object} pageUuids - Page UUIDs from the API
 * @param {string} routePath - Route path to match
 * @returns {string|null} UUID of the page or null if not found
 */
export const getUuidForRoute = (pageUuids, routePath) => {
  // Handle home page
  if (routePath === '/') {
    return pageUuids.required_pages?.page || null;
  }
  
  // Handle other pages
  if (pageUuids.other_pages) {
    const matchingPage = pageUuids.other_pages.find(page => `/${page.path}` === routePath);
    return matchingPage ? matchingPage.uuid : null;
  }
  
  return null;
};

/**
 * Reset function to clear any cached page errors
 * This helps when navigating from an error page to a valid page
 */
export const resetPageState = () => {
  // This is a placeholder function that will be used by the Page component
  return true;
}; 