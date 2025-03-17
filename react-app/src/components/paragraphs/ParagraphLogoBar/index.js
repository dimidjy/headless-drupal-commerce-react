import React from 'react';
import './ParagraphLogoBar.css';

const ParagraphLogoBar = ({ images }) => {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="logo-bar-container">
      <div className="logo-bar">
        {images && images.map((image, index) => (
          <div className="logo-item" key={index}>
            <img 
              src={(image.mediaImage.variations && image.mediaImage.variations[0]?.url) || image.mediaImage.url} 
              alt={image.mediaImage.alt || ''} 
              width={image.mediaImage.width}
              height={image.mediaImage.height}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParagraphLogoBar; 