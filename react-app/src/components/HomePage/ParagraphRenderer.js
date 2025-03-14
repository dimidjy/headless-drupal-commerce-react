import React from 'react';
import {
  ParagraphBillboard,
  ParagraphBlogPosts,
  ParagraphCategories,
  ParagraphFeatures,
  ParagraphFollowUs,
  ParagraphLogoBar,
  ParagraphProductsSlider,
  ParagraphTestimonials,
  ParagraphTestimonialsItem,
  ParagraphTextAndImage,
  ParagraphVideo,
  ParagraphWebform
} from '../../components/paragraphs';

// Helper function to render the appropriate component based on paragraph type
export const renderParagraph = (paragraph) => {
  switch (paragraph.__typename) {
    case 'ParagraphBillboard':
      return <ParagraphBillboard title={paragraph.title} description={paragraph.description} />;
    
    case 'ParagraphBlogPosts':
      return <ParagraphBlogPosts posts={paragraph.posts} />;
    
    case 'ParagraphCategories':
      return <ParagraphCategories title={paragraph.title} />;
    
    case 'ParagraphFeatures':
      return <ParagraphFeatures title={paragraph.title} description={paragraph.description} image={paragraph.image} />;
    
    case 'ParagraphFollowUs':
      return <ParagraphFollowUs title={paragraph.title} />;
    
    case 'ParagraphLogoBar':
      return <ParagraphLogoBar image={paragraph.image} />;
    
    case 'ParagraphProductsSlider':
      return <ParagraphProductsSlider title={paragraph.title} />;
    
    case 'ParagraphTestimonials':
      return <ParagraphTestimonials />;
    
    case 'ParagraphTestimonialsItem':
      return <ParagraphTestimonialsItem author={paragraph.author} />;
    
    case 'ParagraphTextAndImage':
      return <ParagraphTextAndImage title={paragraph.title} link={paragraph.link} image={paragraph.image} />;
    
    case 'ParagraphVideo':
      return <ParagraphVideo video={paragraph.video} />;
    
    case 'ParagraphWebform':
      return <ParagraphWebform />;
    
    default:
      return null;
  }
};

const ParagraphRenderer = ({ paragraphs }) => {
  if (!paragraphs || paragraphs.length === 0) {
    return null;
  }

  return (
    <div className="paragraphs-container">
      {paragraphs.map((paragraph, index) => (
        <div 
          key={paragraph.id || index} 
          className={`paragraph paragraph-${paragraph.__typename.replace('Paragraph', '').toLowerCase()}`}
        >
          {renderParagraph(paragraph)}
        </div>
      ))}
    </div>
  );
};

export default ParagraphRenderer; 