import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart, loading: cartLoading } = useCart();
  const [successMessages, setSuccessMessages] = useState({});
  const [errorMessages, setErrorMessages] = useState({});

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
    
    // Clear any previous messages for this product
    setSuccessMessages(prev => ({
      ...prev,
      [product.id]: false
    }));
    setErrorMessages(prev => ({
      ...prev,
      [product.id]: null
    }));
    
    try {
      await addToCart(product.id, 1);
      
      // Show success message in the UI instead of an alert
      setSuccessMessages(prev => ({
        ...prev,
        [product.id]: true
      }));
      
      // Clear the success message after 3 seconds
      setTimeout(() => {
        setSuccessMessages(prev => ({
          ...prev,
          [product.id]: false
        }));
      }, 3000);
    } catch (err) {
      console.error('Failed to add to cart:', err);
      // Show error message for this specific product
      setErrorMessages(prev => ({
        ...prev,
        [product.id]: 'Failed to add item to cart. Please try again.'
      }));
      
      // Clear the error message after 4 seconds
      setTimeout(() => {
        setErrorMessages(prev => ({
          ...prev,
          [product.id]: null
        }));
      }, 4000);
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
              
              {successMessages[product.id] && (
                <div className="product-message success">
                  Item added to cart successfully!
                </div>
              )}
              
              {errorMessages[product.id] && (
                <div className="product-message error">
                  {errorMessages[product.id]}
                </div>
              )}
              
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