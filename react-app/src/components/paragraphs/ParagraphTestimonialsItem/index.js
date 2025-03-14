import React from 'react';
import './ParagraphTestimonialsItem.css';

const ParagraphTestimonialsItem = ({ author }) => {
  return (
    <div className="testimonial-item">
      <p className="author">{author}</p>
    </div>
  );
};

export default ParagraphTestimonialsItem; 