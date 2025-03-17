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
  ParagraphTextAndImage,
  ParagraphVideo,
  ParagraphWebform
} from '../../components/paragraphs';

// Helper function to render the appropriate component based on paragraph type
export const renderParagraph = (paragraph) => {
  switch (paragraph.__typename) {
    case 'ParagraphBillboard':
      return <ParagraphBillboard title={paragraph.title} description={paragraph.description} slides={paragraph.slides} />;
    
    case 'ParagraphBlogPosts':
      return <ParagraphBlogPosts title={paragraph.title} posts={paragraph.posts} />;
    
    case 'ParagraphCategories':
      return <ParagraphCategories categories={paragraph.categories} />;
    
    case 'ParagraphFeatures':
      return <ParagraphFeatures items={paragraph.items} />;
    
    case 'ParagraphFollowUs':
      return <ParagraphFollowUs title={paragraph.title} image={paragraph.image} />;
    
    case 'ParagraphLogoBar':
      return <ParagraphLogoBar images={paragraph.image} />;
    
    case 'ParagraphProductsSlider':
      console.log('ParagraphProductsSlider', paragraph);
      return <ParagraphProductsSlider title={paragraph.title} products_list={paragraph.productsList} />;
    
    case 'ParagraphTestimonials':
      return <ParagraphTestimonials title={paragraph.title} testimonials={paragraph.testimonials} />;
    
    case 'ParagraphTextAndImage':
      return <ParagraphTextAndImage title={paragraph.title} description={paragraph.description} link={paragraph.link} image={paragraph.image} />;
    
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