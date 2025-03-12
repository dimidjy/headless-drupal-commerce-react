import React, { useState } from 'react';

const ProductListPage = () => {
  // Sample product data - in a real app, this would come from an API
  const [products] = useState([
    { id: 1, name: 'Modern Sofa', price: 899.99, category: 'Living Room', image: 'placeholder.jpg' },
    { id: 2, name: 'Dining Table', price: 499.99, category: 'Dining Room', image: 'placeholder.jpg' },
    { id: 3, name: 'Queen Bed Frame', price: 699.99, category: 'Bedroom', image: 'placeholder.jpg' },
    { id: 4, name: 'Desk Lamp', price: 79.99, category: 'Lighting', image: 'placeholder.jpg' },
    { id: 5, name: 'Bookshelf', price: 249.99, category: 'Storage', image: 'placeholder.jpg' },
    { id: 6, name: 'Coffee Table', price: 199.99, category: 'Living Room', image: 'placeholder.jpg' },
  ]);

  return (
    <div className="product-list-page">
      <h1>Our Products</h1>
      
      <div className="filters">
        <h3>Filter By:</h3>
        {/* Filter components would go here */}
      </div>
      
      <div className="product-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="product-category">{product.category}</p>
              <p className="product-price">${product.price.toFixed(2)}</p>
              <button className="add-to-cart-btn">Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductListPage; 