import React from 'react';

const HomePage = () => {
  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Welcome to Chic Nest</h1>
        <p>Discover stylish furniture for your modern home</p>
        <button className="shop-now-btn">Shop Now</button>
      </div>
      
      <div className="featured-products">
        <h2>Featured Products</h2>
        <div className="product-grid">
          {/* Product items will be rendered here */}
        </div>
      </div>
      
      <div className="about-section">
        <h2>About Chic Nest</h2>
        <p>We offer high-quality, contemporary furniture designed to transform your living spaces.</p>
      </div>
    </div>
  );
};

export default HomePage; 