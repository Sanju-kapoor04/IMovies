import React from 'react';
import MovieCard from './MovieCard';
import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';

const MovieGrid = ({ movies = [], loading = false, emptyMessage = 'No movies found.' }) => {
  if (loading) {
    return <LoadingSpinner text="Loading movies..." />;
  }

  if (!movies || movies.length === 0) {
    return (
      <EmptyState
        icon="bi-camera-reels"
        title="No Movies Found"
        description={emptyMessage}
      />
    );
  }

  return (
    <div className="row g-4 row-cols-2 row-cols-md-3 row-cols-lg-4">
      {movies.map((movie) => (
        <div className="col" key={movie._id}>
          <MovieCard movie={movie} />
        </div>
      ))}
    </div>
  );
};

export default MovieGrid;
