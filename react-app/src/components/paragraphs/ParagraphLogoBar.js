import React from 'react';

const ParagraphLogoBar = ({ image }) => {
  return (
    <div className="logo-bar">
      {image && image.mediaImage && (
        <img 
          src={image.mediaImage.url} 
          alt={image.mediaImage.alt || ''} 
          width={image.mediaImage.width}
          height={image.mediaImage.height}
        />
      )}
    </div>
  );
};

export default ParagraphLogoBar; 