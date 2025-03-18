/**
 * Utility functions for page handling
 */

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
    
    // Use the proxy instead of direct URL to avoid CORS issues
    const response = await fetch(`/api/path-to-uuid?path=/${pathParam}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch page UUID for path ${path}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching page UUID:', error);
    throw error;
  }
}; 

/**
 * Reset function to clear any cached page errors
 * This helps when navigating from an error page to a valid page
 */
export const resetPageState = () => {
  // This is a placeholder function that will be used by the Page component
  return true;
}; 