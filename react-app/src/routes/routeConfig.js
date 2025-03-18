/**
 * This file contains all route configuration for the application
 * Each route has a path, a label (for navigation), and any other metadata needed
 */

// Route configuration for static/predefined pages
export const ROUTES = {
  HOME: {
    path: '/',
    label: 'Home',
  },
  // Add more static routes as needed
  // Example:
  // ABOUT: {
  //   path: '/about',
  //   label: 'About',
  // },
};

/**
 * Generates a complete routes object by combining static routes with dynamic page routes
 * 
 * @param {Object} pageUuids - Page UUIDs from the API
 * @returns {Object} Complete routes object
 */
export const generateRoutes = (pageUuids) => {
  const dynamicRoutes = {};

  // Process dynamic routes from pageUuids.other_pages
  if (pageUuids.other_pages && Array.isArray(pageUuids.other_pages)) {
    pageUuids.other_pages.forEach(page => {
      if (page.path && page.uuid) {
        dynamicRoutes[page.path.toUpperCase().replace(/-/g, '_')] = {
          path: `/${page.path}`,
          label: page.title || page.path,
          uuid: page.uuid
        };
      }
    });
  }

  // Combine static and dynamic routes
  return { ...ROUTES, ...dynamicRoutes };
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
  if (routePath === ROUTES.HOME.path) {
    return pageUuids.required_pages.page;
  }
  
  // Handle other pages
  if (pageUuids.other_pages) {
    const matchingPage = pageUuids.other_pages.find(page => `/${page.path}` === routePath);
    return matchingPage ? matchingPage.uuid : null;
  }
  
  return null;
}; 