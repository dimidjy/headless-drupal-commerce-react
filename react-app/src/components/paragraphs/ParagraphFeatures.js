import React from 'react';

const ParagraphFeatures = ({ title, description, image }) => {
  return (
    <div className="features">
      <h2>{title}</h2>
      <div dangerouslySetInnerHTML={{ __html: description }} />
      {image && <div className="feature-image">Image ID: {image.id}</div>}
    </div>
  );
};

export default ParagraphFeatures; 