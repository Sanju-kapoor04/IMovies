import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { movieService } from '../services/movieService';

const DEFAULT_POSTER = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80';
const DEFAULT_BACKDROP = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedShow, setSelectedShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieAndShows = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch movie details
        const movieData = await movieService.getMovieById(id);
        setMovie(movieData);

        // If NOW_SHOWING, fetch available shows
        if (movieData.status === 'NOW_SHOWING') {
          const showsData = await movieService.getShows({
            movieId: id,
            includePast: false,
          });
          setShows(showsData);

          // Find distinct dates
          const dates = [...new Set(showsData.map((s) => s.showDate))].sort();
          if (dates.length > 0) {
            setSelectedDate(dates[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching movie details:', err);
        setError('Failed to load movie details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieAndShows();
  }, [id]);

  if (loading) {
    return <LoadingSpinner text="Loading movie information & showtimes..." />;
  }

  if (error || !movie) {
    return (
      <div className="container py-5">
        <ErrorMessage message={error || 'Movie not found.'} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  // Get distinct dates for the date picker
  const availableDates = [...new Set(shows.map((s) => s.showDate))].sort();

  // Filter shows by selected date
  const showsForSelectedDate = shows.filter((s) => s.showDate === selectedDate);

  // Group shows by cinema
  const showsByCinema = showsForSelectedDate.reduce((acc, show) => {
    const cinemaId = show.cinemaId?._id || 'unknown';
    if (!acc[cinemaId]) {
      acc[cinemaId] = {
        cinema: show.cinemaId,
        shows: [],
      };
    }
    acc[cinemaId].shows.push(show);
    return acc;
  }, {});

  const handleProceedToSeats = () => {
    if (selectedShow) {
      navigate(`/shows/${selectedShow._id}/seats`);
    }
  };

  const isUpcoming = movie.status === 'UPCOMING';

  return (
    <div className="movie-details-page pb-5">
      {/* Backdrop Header */}
      <div
        className="movie-backdrop-header position-relative"
        style={{
          minHeight: '380px',
          backgroundImage: `url(${movie.backdropUrl || DEFAULT_BACKDROP})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
        }}
      >
        <div
          className="position-absolute inset-0 w-100 h-100"
          style={{
            background:
              'linear-gradient(180deg, rgba(8, 12, 21, 0.4) 0%, rgba(8, 12, 21, 0.8) 60%, var(--bg-primary) 100%)',
          }}
        ></div>

        <div className="container position-relative py-5">
          <div className="row g-4 align-items-end pt-5">
            {/* Movie Poster */}
            <div className="col-md-4 col-lg-3 text-center text-md-start">
              <img
                src={movie.posterUrl || DEFAULT_POSTER}
                alt={movie.title}
                className="img-fluid rounded-4 shadow-lg border border-secondary border-opacity-50"
                style={{ maxHeight: '380px', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = DEFAULT_POSTER;
                }}
              />
            </div>

            {/* Movie Title & Badges */}
            <div className="col-md-8 col-lg-9">
              <div className="d-flex flex-wrap gap-2 mb-2">
                <span
                  className={`badge px-3 py-1 text-uppercase fw-bold ${
                    isUpcoming ? 'badge-upcoming' : 'badge-now-showing'
                  }`}
                >
                  {isUpcoming ? 'Upcoming Premiere' : 'Now In Theaters'}
                </span>
                {movie.isTrending && (
                  <span className="badge bg-warning text-dark px-3 py-1 fw-bold">
                    <i className="bi bi-fire me-1"></i> Trending
                  </span>
                )}
              </div>

              <h1 className="display-4 fw-black text-white mb-2">{movie.title}</h1>

              <div className="d-flex flex-wrap align-items-center gap-3 text-secondary mb-3">
                <div className="text-warning fw-bold fs-5">
                  <i className="bi bi-star-fill me-1"></i>
                  {movie.rating ? movie.rating.toFixed(1) : '8.0'}/10
                </div>
                <span>&bull;</span>
                <span>
                  <i className="bi bi-clock me-1"></i> {movie.duration} mins
                </span>
                <span>&bull;</span>
                <span>
                  <i className="bi bi-translate me-1"></i> {movie.language}
                </span>
                <span>&bull;</span>
                <span>
                  Released: {new Date(movie.releaseDate).toLocaleDateString()}
                </span>
              </div>

              {/* Genre Pills */}
              <div className="d-flex flex-wrap gap-2 mb-4">
                {movie.genre &&
                  movie.genre.map((g, idx) => (
                    <span
                      key={idx}
                      className="badge bg-secondary bg-opacity-25 text-light border border-secondary border-opacity-25 px-3 py-2"
                    >
                      {g}
                    </span>
                  ))}
              </div>

              {/* Trailer button */}
              {movie.trailerUrl && (
                <a
                  href={movie.trailerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-cinema-secondary btn-sm"
                >
                  <i className="bi bi-play-circle-fill text-danger me-1"></i> Watch Official Trailer
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Movie Synopsis and Cast Information */}
      <div className="container mt-4">
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="p-4 rounded-4 bg-dark bg-opacity-40 border border-secondary border-opacity-25 mb-4">
              <h4 className="text-white fw-bold mb-3">Synopsis</h4>
              <p className="text-light text-opacity-80 lh-lg mb-4">
                {movie.description}
              </p>

              {movie.director && (
                <div className="mb-3">
                  <span className="text-secondary small fw-semibold text-uppercase">Director:</span>{' '}
                  <span className="text-white fw-medium">{movie.director}</span>
                </div>
              )}

              {movie.cast && movie.cast.length > 0 && (
                <div>
                  <span className="text-secondary small fw-semibold text-uppercase d-block mb-2">
                    Starring Cast:
                  </span>
                  <div className="d-flex flex-wrap gap-2">
                    {movie.cast.map((actor, idx) => (
                      <span
                        key={idx}
                        className="badge bg-dark text-light border border-secondary border-opacity-50 p-2"
                      >
                        <i className="bi bi-person-fill text-danger me-1"></i>
                        {actor}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Showtime Selection Section */}
            {isUpcoming ? (
              <div className="p-4 rounded-4 bg-purple bg-opacity-10 border border-secondary border-opacity-25 text-center my-4">
                <i className="bi bi-calendar2-heart text-warning fs-1 mb-2 d-block"></i>
                <h4 className="text-white fw-bold">Coming Soon</h4>
                <p className="text-secondary small mb-0" style={{ maxWidth: '450px', margin: '0 auto' }}>
                  Online ticket bookings for this release will open closer to the premiere date. Stay tuned!
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-4 bg-dark bg-opacity-40 border border-secondary border-opacity-25">
                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                  <div>
                    <h4 className="text-white fw-bold mb-0">Select Showtimes</h4>
                    <p className="text-secondary small mb-0">
                      Choose date, venue, and time slot
                    </p>
                  </div>
                </div>

                {/* Date Picker Bar */}
                {availableDates.length > 0 ? (
                  <div className="d-flex gap-2 overflow-x-auto pb-3 mb-4">
                    {availableDates.map((dateStr) => {
                      const dateObj = new Date(dateStr + 'T00:00:00');
                      const dayName = dateObj.toLocaleDateString(undefined, { weekday: 'short' });
                      const dayNum = dateObj.getDate();
                      const month = dateObj.toLocaleDateString(undefined, { month: 'short' });
                      const isSelected = selectedDate === dateStr;

                      return (
                        <button
                          key={dateStr}
                          type="button"
                          onClick={() => {
                            setSelectedDate(dateStr);
                            setSelectedShow(null);
                          }}
                          className={`btn text-center px-3 py-2 rounded-3 transition-all ${
                            isSelected
                              ? 'btn-cinema-primary shadow-sm'
                              : 'btn-dark border border-secondary border-opacity-25 text-secondary'
                          }`}
                          style={{ minWidth: '78px' }}
                        >
                          <div className="small fw-semibold text-uppercase">{dayName}</div>
                          <div className="fs-5 fw-bold text-white">{dayNum}</div>
                          <div className="small">{month}</div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-muted small my-3">
                    No future showtimes currently scheduled for this movie.
                  </div>
                )}

                {/* Shows Grouped by Cinema */}
                {Object.keys(showsByCinema).length > 0 ? (
                  <div className="d-flex flex-column gap-4">
                    {Object.values(showsByCinema).map(({ cinema, shows: cinemaShows }) => (
                      <div
                        key={cinema?._id || Math.random()}
                        className="p-3 rounded-3 bg-black bg-opacity-40 border border-secondary border-opacity-25"
                      >
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div>
                            <h6 className="text-white fw-bold mb-1">
                              <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                              {cinema?.name}
                            </h6>
                            <span className="text-secondary small">
                              {cinema?.location}, {cinema?.city}
                            </span>
                          </div>
                          {cinema?.facilities && (
                            <div className="d-none d-md-flex gap-1">
                              {cinema.facilities.slice(0, 2).map((fac, idx) => (
                                <span key={idx} className="badge bg-secondary bg-opacity-25 text-muted small">
                                  {fac}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Showtime Interactive Buttons */}
                        <div className="d-flex flex-wrap gap-2">
                          {cinemaShows.map((show) => {
                            const isSelected = selectedShow?._id === show._id;

                            return (
                              <button
                                key={show._id}
                                type="button"
                                onClick={() => setSelectedShow(show)}
                                className={`btn px-3 py-2 rounded-3 text-start transition-all ${
                                  isSelected
                                    ? 'btn-danger border-light'
                                    : 'btn-dark border border-secondary border-opacity-50 text-light'
                                }`}
                              >
                                <div className="fw-bold">{show.showTime}</div>
                                <div className="small text-secondary" style={{ fontSize: '0.75rem' }}>
                                  {show.screenName} &bull; ${show.ticketPrice.toFixed(2)}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  availableDates.length > 0 && (
                    <div className="text-center p-4 text-secondary small">
                      No shows available for the selected date. Please choose another date.
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* Booking Summary Sidebar Card */}
          <div className="col-lg-4">
            <div className="p-4 rounded-4 bg-dark bg-opacity-75 border border-secondary border-opacity-50 sticky-top" style={{ top: '90px' }}>
              <h5 className="text-white fw-bold mb-3">Booking Details</h5>

              <div className="mb-3">
                <span className="text-secondary small d-block">Movie:</span>
                <span className="text-white fw-semibold">{movie.title}</span>
              </div>

              {selectedShow ? (
                <>
                  <div className="mb-2">
                    <span className="text-secondary small d-block">Cinema Venue:</span>
                    <span className="text-light fw-medium">{selectedShow.cinemaId?.name}</span>
                  </div>
                  <div className="mb-2">
                    <span className="text-secondary small d-block">Screen:</span>
                    <span className="text-light fw-medium">{selectedShow.screenName}</span>
                  </div>
                  <div className="mb-2">
                    <span className="text-secondary small d-block">Show Date & Time:</span>
                    <span className="text-warning fw-medium">
                      {selectedShow.showDate} at {selectedShow.showTime}
                    </span>
                  </div>
                  <div className="mb-3">
                    <span className="text-secondary small d-block">Ticket Pricing:</span>
                    <span className="text-white fw-bold">
                      Standard: ${selectedShow.ticketPrice.toFixed(2)} | VIP: ${selectedShow.vipPrice.toFixed(2)}
                    </span>
                  </div>

                  <hr className="border-secondary border-opacity-50 my-3" />

                  <button
                    type="button"
                    onClick={handleProceedToSeats}
                    className="btn btn-cinema-primary btn-lg w-100"
                  >
                    <i className="bi bi-grid-3x3-gap-fill me-1"></i>
                    <span>Select Seats Now</span>
                  </button>
                </>
              ) : (
                <div className="text-center p-4 rounded-3 bg-black bg-opacity-30 border border-secondary border-opacity-25 text-secondary small">
                  <i className="bi bi-hand-index-thumb fs-2 mb-2 d-block text-danger"></i>
                  Please pick a cinema venue and showtime to proceed with seat selection.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
