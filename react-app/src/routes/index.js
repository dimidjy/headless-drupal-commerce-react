/**
 * Export all routing-related components and utilities
 */
export { default as AppRoutes } from './AppRoutes';

// Helper function to generate paths with parameters
export const generatePath = (path, params = {}) => {
  let result = path;
  Object.keys(params).forEach(key => {
    result = result.replace(`:${key}`, params[key]);
  });
  return result;
}; 