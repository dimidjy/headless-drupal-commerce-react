import React, { useState, useRef } from 'react';
import './ParagraphProductsSlider.css';
import { Link } from 'react-router-dom';

const ParagraphProductsSlider = ({ title, products_list, view_all_link = '/products' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);

  if (!products_list || products_list.length === 0) {
    return null;
  }

  const handlePrev = () => {
    if (sliderRef.current) {
      const width = sliderRef.current.offsetWidth;
      sliderRef.current.scrollLeft -= width;
      setCurrentIndex(Math.max(currentIndex - 1, 0));
    }
  };

  const handleNext = () => {
    if (sliderRef.current) {
      const width = sliderRef.current.offsetWidth;
      sliderRef.current.scrollLeft += width;
      setCurrentIndex(Math.min(currentIndex + 1, products_list.length - 1));
    }
  };

  // Transform products to display first variation of each product
  const transformedProducts = products_list.map(product => {
    const firstVariation = product.variations && product.variations.length > 0 ? product.variations[0] : null;
    
    return {
      id: product.id,
      title: product.title || (firstVariation ? firstVariation.title : 'Product'),
      url: product.url || `/product/${product.id}`,
      productImage: firstVariation?.productImage?.mediaImage || null,
      price: firstVariation?.price || null
    };
  });

  return (
    <div className="products-slider">
      <div className="slider-header">
        {title && <h2 className="slider-title">{title}</h2>}
        <Link to={view_all_link} className="view-all-link">VIEW ALL PRODUCTS</Link>
      </div>
      <div className="slider-navigation">
        <button className="slider-nav prev" onClick={handlePrev} aria-label="Previous products">
          <span>&#10094;</span>
        </button>
        <div className="slider-container" ref={sliderRef}>
          <div className="products-row">
            {transformedProducts.map((product) => (
              <div key={product.id} className="product-card">
                {product.productImage && (
                  <div className="product-image">
                    <Link to={product.url}>
                      <img 
                        src={product.productImage.variations?.[0]?.url || product.productImage.url} 
                        alt={product.productImage.alt || product.title} 
                      />
                    </Link>
                  </div>
                )}
                <div className="product-info">
                  <h3 className="product-title">
                    <Link to={product.url}>{product.title}</Link>
                  </h3>
                  {product.price && (
                    <div className="product-price">
                      {product.price}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <button className="slider-nav next" onClick={handleNext} aria-label="Next products">
          <span>&#10095;</span>
        </button>
      </div>
    </div>
  );
};

export default ParagraphProductsSlider; 