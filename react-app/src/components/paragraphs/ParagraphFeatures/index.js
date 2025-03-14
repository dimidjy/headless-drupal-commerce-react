import React from 'react';
import './ParagraphFeatures.css';

const ParagraphFeatures = ({ title, description, image }) => {
  return (
    <div className="features">
      <h2>{title}</h2>
      <div dangerouslySetInnerHTML={{ __html: description }} />
      {image && image.mediaImage && (
        <div className="feature-image">
          <img 
            src={(image.mediaImage.variations && image.mediaImage.variations[0]?.url) || image.mediaImage.url} 
            alt={image.mediaImage.alt || ''} 
            width={image.mediaImage.width}
            height={image.mediaImage.height}
          />
        </div>
      )}
    </div>
  );
};

export default ParagraphFeatures; 