import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart, loading: cartLoading } = useCart();

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Using the actual Drupal API endpoint
        const response = await fetch('https://chic-nest.lndo.site/products?_format=json');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        console.log('Products', data);
        // Transform the data to match our expected format if needed
        const formattedProducts = Array.isArray(data) ? data.map(item => ({
          id: item.variation_id,
          title: item.title,
          price: parseFloat(item.price__number) || 0,
          image: item.field_media_image ? `https://chic-nest.lndo.site${item.field_media_image}` : null,
          view_url: item.view_commerce_product || '#'
        })) : [];
        
        setProducts(formattedProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (product, e) => {
    e.preventDefault();
    try {
      await addToCart(product.id, 1);
      // Show success message
      alert('Item added to cart!');
    } catch (err) {
      console.error('Failed to add to cart:', err);
      alert('Failed to add item to cart. Please try again.');
    }
  };

  if (loading) {
    return <div className="products-loading">Loading products...</div>;
  }

  if (error && products.length === 0) {
    return <div className="products-error">Error: {error}</div>;
  }

  return (
    <div className="products-container">
      <h2>Our Products</h2>
      
      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image-container">
              {product.image && (
                <img 
                  src={product.image} 
                  alt={product.title} 
                  className="product-image" 
                />
              )}
            </div>
            
            <div className="product-details">
              <h3 className="product-title">{product.title}</h3>
              <p className="product-price">${parseFloat(product.price).toFixed(2)}</p>
              
              <button 
                onClick={(e) => handleAddToCart(product, e)} 
                className="add-to-cart-btn"
                disabled={cartLoading}
              >
                {cartLoading ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList; 