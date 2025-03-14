import React from 'react';

const ParagraphTextAndImage = ({ title, link, image }) => {
  return (
    <div className="text-and-image">
      <h2>{title}</h2>
      {image && <div className="image">Image ID: {image.id}</div>}
      {link && (
        <a href={link.url} className="cta-link">
          {link.title}
        </a>
      )}
    </div>
  );
};

export default ParagraphTextAndImage; 