import React from 'react';

const LoadingSpinner = ({ text = 'Loading...' }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center p-5 min-vh-25">
      <div className="spinner-border text-danger mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="text-secondary small fw-medium">{text}</p>
    </div>
  );
};

export default LoadingSpinner;
