import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import client from './utils/graphql';

// Pages
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  const [pageConfig, setPageConfig] = useState({
    header_placeholder: '',
    footer_placeholder: '',
    paragraph_ids: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Fetch the main page configuration to get paragraph IDs
    const fetchPageConfig = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/page-config');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch page configuration: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        setPageConfig({
          header_placeholder: data.header_placeholder || 'Header Placeholder',
          footer_placeholder: data.footer_placeholder || 'Footer Placeholder',
          paragraph_ids: data.paragraph_ids || []
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching page configuration:', error);
        setError(error.message);
        setLoading(false);
      }
    };
    
    fetchPageConfig();
  }, []);

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>Loading ChicNest...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-error">
        <h2>Error Loading Page</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="App">
          {/* Header Placeholder */}
          <header className="header">
            <div className="container">
              <div className="header-placeholder">
                {pageConfig.header_placeholder}
              </div>
            </div>
          </header>
          
          {/* Main Content Area with Routes */}
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage paragraphIds={pageConfig.paragraph_ids} />} />
              <Route path="/products" element={<ProductListPage />} />
              <Route path="/products/:productId" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          
          {/* Footer Placeholder */}
          <footer className="footer">
            <div className="container">
              <div className="footer-placeholder">
                {pageConfig.footer_placeholder}
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App; 