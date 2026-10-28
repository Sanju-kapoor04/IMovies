import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container py-5 my-5 text-center">
      <div className="mb-4">
        <i className="bi bi-camera-reels text-danger" style={{ fontSize: '5rem' }}></i>
      </div>
      <h1 className="display-1 fw-black text-white mb-2">404</h1>
      <h3 className="text-white fw-bold mb-3">Lost in the Cinema Lobby?</h3>
      <p className="text-secondary mx-auto mb-4" style={{ maxWidth: '460px' }}>
        The movie reel or page you were searching for has either ended its theatrical run or does not exist.
      </p>
      <Link to="/" className="btn btn-cinema-primary btn-lg">
        <i className="bi bi-house-door me-1"></i> Return to Home
      </Link>
    </div>
  );
};

export default NotFound;
