import React from 'react';
import Paragraph from '../components/Paragraph';
import ParagraphCollection from '../components/ParagraphCollection';

const HomePage = ({ paragraphIds }) => {
  if (!paragraphIds || paragraphIds.length === 0) {
    return (
      <div className="home-page">
        <div className="container">
          <div className="no-paragraphs">
            <h2>No content available</h2>
            <p>There are no paragraphs to display on this page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="container">
        <div className="paragraphs-container">
          {/* Display all paragraphs from the paragraphIds array */}
          <ParagraphCollection ids={paragraphIds} />
        </div>
      </div>
    </div>
  );
};

export default HomePage; 