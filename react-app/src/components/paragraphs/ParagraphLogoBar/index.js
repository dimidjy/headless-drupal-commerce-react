import React from 'react';
import './ParagraphLogoBar.css';

const ParagraphLogoBar = ({ image }) => {
  return (
    <div className="logo-bar">
      {image && image.mediaImage && (
        <img 
          src={(image.mediaImage.variations && image.mediaImage.variations[0]?.url) || image.mediaImage.url} 
          alt={image.mediaImage.alt || ''} 
          width={image.mediaImage.width}
          height={image.mediaImage.height}
        />
      )}
    </div>
  );
};

export default ParagraphLogoBar; 