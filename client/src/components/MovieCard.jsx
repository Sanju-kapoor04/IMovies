import React from 'react';
import { Link } from 'react-router-dom';

const DEFAULT_POSTER = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80';

const MovieCard = ({ movie }) => {
  const isUpcoming = movie.status === 'UPCOMING';

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = DEFAULT_POSTER;
  };

  return (
    <div className="movie-card">
      <div className="movie-poster-wrap">
        {/* Rating Badge */}
        {movie.rating && (
          <div className="movie-rating-badge">
            <i className="bi bi-star-fill"></i>
            <span>{movie.rating.toFixed(1)}</span>
          </div>
        )}

        {/* Status Badge */}
        <span
          className={`movie-status-badge ${
            isUpcoming ? 'badge-upcoming' : 'badge-now-showing'
          }`}
        >
          {isUpcoming ? 'Upcoming' : 'Now Showing'}
        </span>

        {/* Poster Image */}
        <img
          src={movie.posterUrl || DEFAULT_POSTER}
          alt={movie.title}
          className="movie-poster-img"
          onError={handleImageError}
          loading="lazy"
        />
      </div>

      <div className="movie-card-content">
        <h5 className="movie-card-title" title={movie.title}>
          {movie.title}
        </h5>

        <div className="movie-meta">
          <span>
            <i className="bi bi-clock me-1"></i>
            {movie.duration}m
          </span>
          <span>&bull;</span>
          <span>
            <i className="bi bi-translate me-1"></i>
            {movie.language}
          </span>
        </div>

        {/* Genre Tags */}
        <div className="genre-tags">
          {movie.genre &&
            movie.genre.slice(0, 3).map((g, idx) => (
              <span key={idx} className="genre-pill">
                {g}
              </span>
            ))}
        </div>

        {/* Action Button */}
        <div className="mt-auto pt-2">
          <Link
            to={`/movies/${movie._id}`}
            className={`w-100 ${
              isUpcoming ? 'btn btn-cinema-secondary' : 'btn btn-cinema-primary'
            } btn-sm text-center`}
          >
            <i className={`bi ${isUpcoming ? 'bi-info-circle' : 'bi-ticket-perforated'} me-1`}></i>
            {isUpcoming ? 'View Details' : 'Book Tickets'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
