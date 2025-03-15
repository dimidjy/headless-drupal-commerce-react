import React from 'react';
import './ParagraphFeatures.css';

const ParagraphFeatures = ({ items }) => {
  return (
    <div className="features">
      {items && items.map((item) => (
        <div key={item.id}>
          <img 
            src={(item.featureImage.mediaImage.variations && item.featureImage.mediaImage.variations[0]?.url) || item.featureImage.mediaImage.url} 
            alt={item.featureImage.mediaImage.alt || ''} 
          />
          <h2>{item.title}</h2>
          <div dangerouslySetInnerHTML={{ __html: item.description }} />
        </div>
      ))}
    </div>
  );
};

export default ParagraphFeatures; 