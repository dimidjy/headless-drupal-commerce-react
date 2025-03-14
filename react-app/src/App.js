import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import client from './utils/graphql';

// Pages
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  const [pageUuids, setPageUuids] = useState({
    required_pages: {},
    other_pages: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Fetch the page UUIDs from the new endpoint
    const fetchPageUuids = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/page-uuids');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch page UUIDs: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        setPageUuids(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching page UUIDs:', error);
        setError(error.message);
        setLoading(false);
      }
    };
    
    fetchPageUuids();
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

  console.log(pageUuids)

  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="App">
          {/* Header Placeholder */}
          <header className="header">
            <div className="container">
              <div className="header-placeholder">
                Header Placeholder
              </div>
            </div>
          </header>
          
          {/* Main Content Area with Routes */}
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage homepageUuid={pageUuids.required_pages.homepage} />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          
          {/* Footer Placeholder */}
          <footer className="footer">
            <div className="container">
              <div className="footer-placeholder">
                Footer Placeholder
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App; 