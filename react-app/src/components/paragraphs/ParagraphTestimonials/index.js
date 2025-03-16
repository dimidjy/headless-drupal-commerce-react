import React, { useState, useEffect } from 'react';
import './ParagraphTestimonials.css';

const ParagraphTestimonials = ({ title, testimonials }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current === testimonials.length - 1 ? 0 : current + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handleDotClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <div className="testimonials">
      <h2>{title}</h2>

      <div className="testimonials-container">
        {testimonials.map((testimonial, index) => (
          <div 
            key={testimonial.id} 
            className={`testimonial ${index === activeIndex ? 'active' : 'hidden'}`}
            style={{ display: index === activeIndex ? 'block' : 'none' }}
          >
            <p>"{testimonial.response}"</p>
            <p className="testimonial-author">{testimonial.author}</p>
          </div>
        ))}
        
        <div className="testimonial-dots">
          {testimonials.map((_, index) => (
            <span 
              key={index} 
              className={`dot ${index === activeIndex ? 'active' : ''}`}
              onClick={() => handleDotClick(index)}
            ></span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParagraphTestimonials; 