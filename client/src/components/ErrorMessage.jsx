import React from 'react';

const ErrorMessage = ({ message = 'Something went wrong. Please try again.', onRetry }) => {
  return (
    <div className="alert alert-danger bg-danger bg-opacity-10 border border-danger border-opacity-50 text-white rounded-3 p-4 my-4 d-flex align-items-center justify-content-between flex-wrap gap-3">
      <div className="d-flex align-items-center gap-3">
        <i className="bi bi-exclamation-triangle-fill fs-2 text-danger"></i>
        <div>
          <h6 className="fw-bold mb-1">Notice</h6>
          <div className="text-light text-opacity-75 small">{message}</div>
        </div>
      </div>
      {onRetry && (
        <button className="btn btn-sm btn-outline-danger" onClick={onRetry}>
          <i className="bi bi-arrow-clockwise me-1"></i> Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
