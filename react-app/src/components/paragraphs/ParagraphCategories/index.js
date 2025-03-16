import React from 'react';
import './ParagraphCategories.css';

const ParagraphCategories = ({ categories }) => {
  return (
    <div className="categories">
      <div className="categories-list">
        {categories.map((category) => (
          <div key={category.id} className="category-item">
            <a href={`/shop/${category.id}`}>
              <img src={category.shopImage.mediaImage.variations[0].url} alt={category.name} />
              <h3>{category.name}</h3>  
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParagraphCategories; 