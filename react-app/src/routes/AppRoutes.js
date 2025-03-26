import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Pages
import Page from '../pages/Page';
import NotFoundPage from '../pages/NotFoundPage';

// Custom Pages
import { CartPage, CheckoutPage, ProductsPage, ProductPage } from '../pages/custom';
import OrderSuccessPage from '../pages/custom/Checkout/OrderSuccessPage';

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
      
      {/* Custom Pages */}
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/order-success" element={<OrderSuccessPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/product/:id" element={<ProductPage />} />
      
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