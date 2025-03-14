import React from 'react';

export const NoUuid = () => (
  <div className="home-page">
    <div className="container">
      <div className="no-uuid">
        <h2>No UUID available</h2>
        <p>Homepage UUID is not available.</p>
      </div>
    </div>
  </div>
);

export const Loading = () => (
  <div className="home-page">
    <div className="container">
      <div className="loading">
        <h2>Loading...</h2>
        <p>Fetching homepage content.</p>
      </div>
    </div>
  </div>
);

export const ErrorMessage = ({ message }) => (
  <div className="home-page">
    <div className="container">
      <div className="error">
        <h2>Error</h2>
        <p>{message}</p>
      </div>
    </div>
  </div>
);

export const NoContent = () => (
  <div className="home-page">
    <div className="container">
      <div className="no-content">
        <h2>No content available</h2>
        <p>The homepage content could not be found.</p>
      </div>
    </div>
  </div>
); 