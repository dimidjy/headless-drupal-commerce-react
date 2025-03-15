import React from 'react';
import { getImageUrl, getImageData } from '../../../utils/imageUtils';
import './ParagraphTextAndImage.css';

const ParagraphTextAndImage = ({ title, description, link, image }) => {
  const imageUrl = getImageUrl(image);
  const imageData = getImageData(image);
  
  return (
    <div className="text-and-image">
      {imageUrl && imageData && (
        <div className="image">
          <img 
            src={imageUrl} 
            alt={imageData.alt || ''} 
          />
        </div>
      )}
      <div className="content">
        <h2>{title}</h2>
        {description && <div className="description">{description}</div>}
        {link && (
          <a href={link.url} className="cta-link">
            {link.title || 'SHOP COLLECTION'}
          </a>
        )}
      </div>
    </div>
  );
};

export default ParagraphTextAndImage; 