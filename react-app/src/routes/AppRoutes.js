import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Pages
import Page from '../pages/Page';
import NotFoundPage from '../pages/NotFoundPage';

/**
 * AppRoutes component handles all the application routing
 * 
 * @returns {JSX.Element} Routes configuration for the application
 */
const AppRoutes = () => {
  return (
    <Routes>
      {/* Home route */}
      <Route 
        path="/" 
        element={<Page />} 
      />
      
      {/* Dynamic routes - any path */}
      <Route 
        path="/:path*" 
        element={<Page />}
      />
      
      {/* Not found page - should be the last route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes; 