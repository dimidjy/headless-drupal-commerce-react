import React from 'react';

const ParagraphTextAndImage = ({ title, link, image }) => {
  return (
    <div className="text-and-image">
      <h2>{title}</h2>
      {image && image.mediaImage && (
        <div className="image">
          <img 
            src={(image.mediaImage.variations && image.mediaImage.variations[0]?.url) || image.mediaImage.url} 
            alt={image.mediaImage.alt || ''} 
            width={image.mediaImage.width}
            height={image.mediaImage.height}
          />
        </div>
      )}
      {link && (
        <a href={link.url} className="cta-link">
          {link.title}
        </a>
      )}
    </div>
  );
};

export default ParagraphTextAndImage; 