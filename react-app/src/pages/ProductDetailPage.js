import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const ProductDetailPage = () => {
  const { productId } = useParams();
  
  // In a real app, you would fetch the product details based on the productId
  const [product] = useState({
    id: 1,
    name: 'Modern Sofa',
    price: 899.99,
    description: 'A comfortable and stylish sofa perfect for modern living rooms. Features durable fabric upholstery and solid wood legs.',
    category: 'Living Room',
    image: 'placeholder.jpg',
    colors: ['Gray', 'Blue', 'Beige'],
    inStock: true
  });
  
  const [quantity, setQuantity] = useState(1);
  
  const handleQuantityChange = (e) => {
    setQuantity(parseInt(e.target.value));
  };
  
  const handleAddToCart = () => {
    // Add to cart functionality would go here
    console.log(`Added ${quantity} of ${product.name} to cart`);
  };

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        <div className="product-image-section">
          <img src={product.image} alt={product.name} />
        </div>
        
        <div className="product-info-section">
          <h1>{product.name}</h1>
          <p className="product-price">${product.price.toFixed(2)}</p>
          <p className="product-description">{product.description}</p>
          
          <div className="product-options">
            <div className="color-options">
              <h3>Color:</h3>
              <div className="color-selector">
                {product.colors.map(color => (
                  <button key={color} className="color-option">{color}</button>
                ))}
              </div>
            </div>
            
            <div className="quantity-selector">
              <h3>Quantity:</h3>
              <input 
                type="number" 
                min="1" 
                value={quantity} 
                onChange={handleQuantityChange} 
              />
            </div>
          </div>
          
          <div className="product-actions">
            <button 
              className="add-to-cart-btn" 
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
          
          <div className="product-meta">
            <p>Category: {product.category}</p>
            <p>Availability: {product.inStock ? 'In Stock' : 'Out of Stock'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage; 