import React, { useState, useRef, useEffect } from 'react';
import './ParagraphBillboard.css';

const ParagraphBillboard = ({ title, description, slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slidesContainerRef = useRef(null);
  const totalSlides = slides?.length || 0;
  const [loadedImages, setLoadedImages] = useState([]);
  const [maxSlideIndex, setMaxSlideIndex] = useState(0);
  
  const handlePrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleNextSlide = () => {
    if (currentSlide < maxSlideIndex) {
      setCurrentSlide(currentSlide + 1);
    }
  };
  
  useEffect(() => {
    if (slidesContainerRef.current && totalSlides > 0) {
      const visibleSlides = Math.min(3, totalSlides);
      const maxIndex = Math.max(0, totalSlides - visibleSlides);
      setMaxSlideIndex(maxIndex);
      
      const slideWidth = slidesContainerRef.current.offsetWidth / visibleSlides;
      slidesContainerRef.current.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
    }
  }, [currentSlide, totalSlides]);

  // Image processing functions
  const getImageUrl = (imageArray) => {
    if (!imageArray || !imageArray.length || !imageArray[0].mediaImage) return '';
    return imageArray[0].mediaImage.variations?.[0]?.url || imageArray[0].mediaImage.url || '';
  };

  const getImageAlt = (imageArray, fallbackTitle) => {
    if (!imageArray || !imageArray.length || !imageArray[0].mediaImage) return fallbackTitle || '';
    return imageArray[0].mediaImage.alt || fallbackTitle || '';
  };

  const handleImageLoad = (index) => {
    setLoadedImages((prev) => [...prev, index]);
  };

  const isImageLoaded = (index) => {
    return loadedImages.includes(index);
  };

  // If no slides, don't render anything
  if (!slides || slides.length === 0) {
    return null;
  }

  // Determine how many slides to show at once (max 3)
  const visibleSlides = Math.min(3, totalSlides);

  return (
    <div className="billboard-container">
      <div className="billboard-header">
        <h2 className="billboard-title">{title}</h2>
        {description && (
          <div className="billboard-description" dangerouslySetInnerHTML={{ __html: description }} />
        )}
      </div>
      
      <div className="billboard-slides">
        {totalSlides > visibleSlides && currentSlide > 0 && (
          <button 
            className="slide-nav prev-slide" 
            aria-label="Previous slide"
            onClick={handlePrevSlide}
          >
            <span>&#10094;</span>
          </button>
        )}
        
        <div className="slides-wrapper">
          <div 
            className="slides-container" 
            ref={slidesContainerRef}
            style={{
              display: 'flex',
              transition: 'transform 0.5s ease',
              width: `${totalSlides * 100 / visibleSlides}%`
            }}
          >
            {slides.map((slide, index) => (
              <div 
                key={index} 
                className="slide"
                style={{ width: `${100 / totalSlides}%` }}
              >
                {slide.image && slide.image.length > 0 && (
                  <div className={`slide-image ${isImageLoaded(index) ? 'loaded' : 'loading'}`}>
                    <img 
                      src={getImageUrl(slide.image)} 
                      alt={getImageAlt(slide.image, slide.title)} 
                      onLoad={() => handleImageLoad(index)}
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="slide-content">
                  {slide.title && <h3 className="slide-title">{slide.title}</h3>}
                  {slide.description && (
                    <div className="slide-description" dangerouslySetInnerHTML={{ __html: slide.description }} />
                  )}
                  {slide.link && (
                    <a href={slide.link.url} className="slide-link">
                      {slide.link.title || 'DISCOVER NOW'}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {totalSlides > visibleSlides && currentSlide < maxSlideIndex && (
          <button 
            className="slide-nav next-slide" 
            aria-label="Next slide"
            onClick={handleNextSlide}
          >
            <span>&#10095;</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ParagraphBillboard; 