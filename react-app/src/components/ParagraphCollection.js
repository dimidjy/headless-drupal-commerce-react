import React from 'react';
import Paragraph from './Paragraph';

const ParagraphCollection = ({ ids }) => {
  if (!ids || !ids.length) {
    return <div className="paragraph-collection-empty">No paragraphs to display</div>;
  }

  return (
    <div className="paragraph-collection">
      {ids.map((id) => (
        <Paragraph key={id} id={id} />
      ))}
    </div>
  );
};

export default ParagraphCollection; 