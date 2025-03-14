import React from 'react';
import './ParagraphTextAndImage.css';

const ParagraphTextAndImage = ({ title, link, image }) => {
  function getImageUrl(image) {
    if (image) {
      // Check if image is an array and has at least one element
      if (Array.isArray(image) && image.length > 0) {
        // Access the mediaImage from the first element of the array
        const mediaItem = image[0];
        if (mediaItem && mediaItem.mediaImage && mediaItem.mediaImage.variations && 
            mediaItem.mediaImage.variations.length > 0) {
          return mediaItem.mediaImage.variations[0].url;
        }
      } else if (image.mediaImage && image.mediaImage.variations && 
                image.mediaImage.variations.length > 0) {
        // Handle case where image is directly an object with mediaImage property
        return image.mediaImage.variations[0].url;
      }
    }
    return null;
  }

  const imageUrl = getImageUrl(image);
  
  // Also update the image references to handle the array structure
  const imageData = Array.isArray(image) && image.length > 0 ? image[0].mediaImage : 
                   (image && image.mediaImage ? image.mediaImage : null);
  
  return (
    <div className="text-and-image">
      <h2>{title}</h2>
      {imageUrl && imageData && (
        <div className="image">
          <img 
            src={imageUrl} 
            alt={imageData.alt || ''} 
            width='200px'
            height='200px'
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