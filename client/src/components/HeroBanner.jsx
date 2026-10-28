import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const DEFAULT_BACKDROP = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80';

const HeroBanner = ({ featuredMovies = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (featuredMovies.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [featuredMovies.length]);

  if (!featuredMovies || featuredMovies.length === 0) {
    return null;
  }

  const movie = featuredMovies[currentIndex] || featuredMovies[0];

  return (
    <div
      className="hero-banner"
      style={{
        backgroundImage: `url(${movie.backdropUrl || DEFAULT_BACKDROP})`,
      }}
    >
      <div className="hero-overlay"></div>
      <div className="container">
        <div className="hero-content">
          {/* Tagline / Category */}
          <div className="d-flex align-items-center gap-2 mb-3">
            <span className="badge bg-danger text-uppercase px-2 py-1 fw-bold">
              Featured Premiere
            </span>
            {movie.isTrending && (
              <span className="badge bg-warning text-dark px-2 py-1 fw-bold">
                <i className="bi bi-fire me-1"></i> Trending #1
              </span>
            )}
            <span className="text-secondary small">
              <i className="bi bi-clock me-1"></i> {movie.duration} mins
            </span>
          </div>

          {/* Title */}
          <h1 className="display-4 fw-black text-white mb-3 text-shadow">
            {movie.title}
          </h1>

          {/* Meta details */}
          <div className="d-flex flex-wrap align-items-center gap-3 mb-3 text-light">
            <div className="d-flex align-items-center text-warning fw-bold">
              <i className="bi bi-star-fill me-1"></i>
              <span>{movie.rating ? movie.rating.toFixed(1) : '8.5'}/10</span>
            </div>
            <span>&bull;</span>
            <span className="text-muted">{movie.language}</span>
            <span>&bull;</span>
            <div className="d-flex gap-1">
              {movie.genre &&
                movie.genre.map((g, idx) => (
                  <span key={idx} className="genre-pill">
                    {g}
                  </span>
                ))}
            </div>
          </div>

          {/* Synopsis */}
          <p className="text-light text-opacity-75 fs-6 mb-4 line-clamp-3 pe-lg-4" style={{ maxWidth: '600px' }}>
            {movie.description}
          </p>

          {/* Actions */}
          <div className="d-flex flex-wrap gap-3">
            <Link to={`/movies/${movie._id}`} className="btn btn-cinema-primary btn-lg">
              <i className="bi bi-ticket-perforated-fill fs-5"></i>
              <span>Book Tickets Now</span>
            </Link>

            {movie.trailerUrl && (
              <a
                href={movie.trailerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-cinema-secondary btn-lg"
              >
                <i className="bi bi-play-circle-fill fs-5 text-danger"></i>
                <span>Watch Trailer</span>
              </a>
            )}
          </div>

          {/* Carousel dots if multiple featured movies */}
          {featuredMovies.length > 1 && (
            <div className="d-flex gap-2 mt-4">
              {featuredMovies.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`btn p-0 rounded-pill border-0 transition-all ${
                    idx === currentIndex
                      ? 'bg-danger'
                      : 'bg-secondary bg-opacity-50'
                  }`}
                  style={{
                    width: idx === currentIndex ? '28px' : '8px',
                    height: '8px',
                  }}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
