import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ProductsPage.css';

const ProductsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://chic-nest.lndo.site/products');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="products-container">
        <h1 className="products-title">Our Products</h1>
        <div className="products-loading">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-container">
        <h1 className="products-title">Our Products</h1>
        <div className="products-error">Error loading products: {error}</div>
      </div>
    );
  }

  return (
    <div className="products-container">
      <h1 className="products-title">Our Products</h1>
      
      {products.length === 0 ? (
        <div className="products-empty">
          <p>No products available at the moment.</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product, index) => (
            <div key={index} className="product-card">
              <div className="product-image">
                {product.field_media_image && (
                  <img 
                    src={`https://chic-nest.lndo.site${product.field_media_image}`}
                    alt={product.title} 
                  />
                )}
              </div>
              <div className="product-details">
                <h3 className="product-title">{product.title}</h3>
                <div className="product-price">
                  ${product.price__number}
                </div>
                <Link 
                  to={product.view_commerce_product}
                  className="btn product-view-btn"
                >
                  View Product
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage; 