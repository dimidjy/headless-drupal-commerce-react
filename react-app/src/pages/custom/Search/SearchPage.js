import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './SearchPage.css';

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all products when component mounts
  useEffect(() => {
    fetchProducts();
  }, []);

  // Function to fetch all products or filtered products
  const fetchProducts = async (term = '') => {
    setLoading(true);
    setError(null);
    
    try {
      const url = term 
        ? `https://chic-nest.lndo.site/api/search-products?_format=json&search=${encodeURIComponent(term)}`
        : 'https://chic-nest.lndo.site/api/search-products?_format=json';
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setSearchResults(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(searchTerm.trim());
  };

  // Render a product item based on available data
  const renderProductItem = (product, index) => {
    const ProductWrapper = product.url ? ({ children }) => (
      <a href={product.url} className="product-link">{children}</a>
    ) : ({ children }) => (
      <div>{children}</div>
    );

    return (
      <div key={index} className="product-item">
        <ProductWrapper>
          <h3 className="product-title">{product.title}</h3>
          {product.description && (
            <p className="product-description">{product.description}</p>
          )}
          {product.price && (
            <div className="product-price">{product.price}</div>
          )}
          {product.image && (
            <div className="product-image-container">
              <img src={product.image} alt={product.title} className="product-image" />
            </div>
          )}
        </ProductWrapper>
      </div>
    );
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Product Search</h1>
        <div className="breadcrumbs">
          <Link to="/">Home</Link> / <span>Search</span>
        </div>
      </div>
      
      <div className="page-content">
        <div className="search-container">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for products..."
              className="search-input"
            />
            <button type="submit" className="search-button">
              Search
            </button>
          </form>
          
          {error && (
            <div className="search-error">
              Error: {error}
            </div>
          )}
          
          {loading ? (
            <div className="loading">Loading products...</div>
          ) : (
            <div className="search-results">
              <h2>Search Results</h2>
              {searchResults.length === 0 ? (
                <div className="no-results">
                  No products found{searchTerm ? ` for "${searchTerm}"` : ''}.
                </div>
              ) : (
                <div className="results-list">
                  {searchResults.map(renderProductItem)}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage; 