import React from 'react';
import './ParagraphFollowUs.css';

const ParagraphFollowUs = ({ title, image }) => {
  return (
    <div className="follow-us">
      <div className="image-slider">
        {image && image.map((item, index) => (
          <div className="slider-image" key={`follow-us-image-${index}`}>
            <img src={item.mediaImage.variations[0].url} alt={item.mediaImage.alt} />
          </div>
        ))}
      </div>
      <div className="instagram-button">
        <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
          Follow us on Instagram
        </a>
      </div>
    </div>
  );
};

export default ParagraphFollowUs; 