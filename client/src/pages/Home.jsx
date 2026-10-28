import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HeroBanner from '../components/HeroBanner';
import MovieGrid from '../components/MovieGrid';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { movieService } from '../services/movieService';

const Home = () => {
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [nowShowingMovies, setNowShowingMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch Now Showing, Upcoming, and Trending
        const [nowShowingRes, upcomingRes] = await Promise.all([
          movieService.getMovies({ status: 'NOW_SHOWING', limit: 8 }),
          movieService.getMovies({ status: 'UPCOMING', limit: 4 }),
        ]);

        const allNowShowing = nowShowingRes.movies || [];
        const allUpcoming = upcomingRes.movies || [];

        setNowShowingMovies(allNowShowing);
        setUpcomingMovies(allUpcoming);

        // Filter trending
        const trending = allNowShowing.filter((m) => m.isTrending);
        setTrendingMovies(trending.length > 0 ? trending : allNowShowing.slice(0, 4));

        // Featured for hero banner
        const featured = allNowShowing.filter((m) => m.backdropUrl);
        setFeaturedMovies(featured.length > 0 ? featured : allNowShowing.slice(0, 3));
      } catch (err) {
        console.error('Error fetching home movies:', err);
        setError('Unable to load movie listings from server. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const handleSearchSubmit = (searchTerm) => {
    if (searchTerm) {
      navigate(`/movies?search=${encodeURIComponent(searchTerm)}`);
    } else {
      navigate('/movies');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading latest premieres..." />;
  }

  if (error) {
    return (
      <div className="container py-5">
        <ErrorMessage message={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div className="home-page pb-5">
      {/* Hero Banner Carousel */}
      <HeroBanner featuredMovies={featuredMovies} />

      <div className="container">
        {/* Search Bar Section */}
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8">
            <div className="text-center mb-3">
              <h4 className="text-white fw-bold">Find Your Next Cinema Experience</h4>
              <p className="text-secondary small">
                Explore blockbusters in IMAX 3D, Dolby Atmos, and Laser 4K.
              </p>
            </div>
            <SearchBar onSearch={handleSearchSubmit} placeholder="Search movies by title, genre, actor..." />
          </div>
        </div>

        {/* Trending Section */}
        {trendingMovies.length > 0 && (
          <section className="mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <span className="badge bg-danger bg-opacity-25 text-danger border border-danger border-opacity-50 mb-1 px-2 py-1">
                  <i className="bi bi-fire me-1"></i> Hot Right Now
                </span>
                <h3 className="text-white fw-bold mb-0">Trending Movies</h3>
              </div>
              <Link to="/movies?isTrending=true" className="btn btn-cinema-outline btn-sm">
                View All <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
            <MovieGrid movies={trendingMovies.slice(0, 4)} />
          </section>
        )}

        {/* Now Showing Section */}
        <section className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <span className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-50 mb-1 px-2 py-1">
                <i className="bi bi-play-circle me-1"></i> In Cinemas Today
              </span>
              <h3 className="text-white fw-bold mb-0">Now Showing</h3>
            </div>
            <Link to="/movies?status=NOW_SHOWING" className="btn btn-cinema-outline btn-sm">
              See All Shows <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
          <MovieGrid movies={nowShowingMovies} />
        </section>

        {/* Upcoming Releases Section */}
        {upcomingMovies.length > 0 && (
          <section className="mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <span className="badge bg-purple bg-opacity-25 text-white border border-light border-opacity-25 mb-1 px-2 py-1" style={{ backgroundColor: '#8b5cf6' }}>
                  <i className="bi bi-clock-history me-1"></i> Coming Soon
                </span>
                <h3 className="text-white fw-bold mb-0">Upcoming Releases</h3>
              </div>
              <Link to="/movies?status=UPCOMING" className="btn btn-cinema-outline btn-sm">
                View All Upcoming <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
            <MovieGrid movies={upcomingMovies} />
          </section>
        )}

        {/* Cinema Experience Features Banner */}
        <section className="p-4 p-md-5 rounded-4 bg-dark bg-opacity-50 border border-secondary border-opacity-25 my-5">
          <div className="row g-4 align-items-center text-center text-md-start">
            <div className="col-md-3">
              <div className="d-flex flex-column align-items-center align-items-md-start gap-2">
                <i className="bi bi-display text-danger fs-1"></i>
                <h5 className="text-white fw-bold mb-1">IMAX Laser 3D</h5>
                <p className="text-secondary small mb-0">
                  Crystal-clear 4K images and precision audio engineering.
                </p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="d-flex flex-column align-items-center align-items-md-start gap-2">
                <i className="bi bi-soundwave text-info fs-1"></i>
                <h5 className="text-white fw-bold mb-1">Dolby Atmos</h5>
                <p className="text-secondary small mb-0">
                  Multi-dimensional spatial sound flowing all around you.
                </p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="d-flex flex-column align-items-center align-items-md-start gap-2">
                <i className="bi bi-shield-lock text-success fs-1"></i>
                <h5 className="text-white fw-bold mb-1">Guaranteed Seats</h5>
                <p className="text-secondary small mb-0">
                  Atomic lock reservation prevents duplicate seat conflicts.
                </p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="d-flex flex-column align-items-center align-items-md-start gap-2">
                <i className="bi bi-phone text-warning fs-1"></i>
                <h5 className="text-white fw-bold mb-1">Digital e-Ticket</h5>
                <p className="text-secondary small mb-0">
                  Scan bar codes straight from your mobile device.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
