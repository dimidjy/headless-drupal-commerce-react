import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Component to display when page UUID is not available
 */
export const NoUuid = () => (
  <div className="status-message error">
    <h2>Page Not Found</h2>
    <p>This page could not be found in our system.</p>
  </div>
);

/**
 * Component to display when content is loading
 */
export const Loading = ({ message = 'Loading content...' }) => (
  <div className="status-message loading">
    <div className="loading-spinner"></div>
    <p>{message}</p>
  </div>
);

/**
 * Component to display when there's an error
 */
export const ErrorMessage = ({ message }) => {
  const navigate = useNavigate();
  
  const goHome = () => {
    navigate('/');
  };
  
  return (
    <div className="status-message error">
      <h2>Error Loading Content</h2>
      <p>{message}</p>
      <div className="error-actions">
        <button onClick={() => window.location.reload()}>Try Again</button>
        <button onClick={goHome}>Go Home</button>
      </div>
    </div>
  );
};

/**
 * Component to display when content is not available
 */
export const NoContent = () => (
  <div className="status-message warning">
    <h2>No Content Available</h2>
    <p>The requested content could not be found.</p>
  </div>
); 