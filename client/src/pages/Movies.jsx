import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MovieGrid from '../components/MovieGrid';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { movieService } from '../services/movieService';

const Movies = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [movies, setMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [availableGenres, setAvailableGenres] = useState([]);
  const [availableLanguages, setAvailableLanguages] = useState([]);

  // Extract query filters
  const currentStatus = searchParams.get('status') || '';
  const currentGenre = searchParams.get('genre') || '';
  const currentLanguage = searchParams.get('language') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || 'rating';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  // Fetch filter metadata (distinct genres & languages)
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const data = await movieService.getFilters();
        setAvailableGenres(data.genres || []);
        setAvailableLanguages(data.languages || []);
      } catch (err) {
        console.warn('Could not load filters metadata:', err);
      }
    };
    fetchMetadata();
  }, []);

  // Fetch movies whenever search params change
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = {
          page: currentPage,
          limit: 12,
          sort: currentSort,
        };

        if (currentStatus) params.status = currentStatus;
        if (currentGenre) params.genre = currentGenre;
        if (currentLanguage) params.language = currentLanguage;
        if (currentSearch) params.search = currentSearch;

        const data = await movieService.getMovies(params);
        setMovies(data.movies || []);
        setTotalPages(data.totalPages || 1);
        setTotalCount(data.total || 0);
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError('Failed to fetch movies. Please check your network connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [currentStatus, currentGenre, currentLanguage, currentSearch, currentSort, currentPage]);

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1'); // reset to page 1 on filter change
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (searchTerm) => {
    handleFilterChange('search', searchTerm);
  };

  const handleResetFilters = () => {
    setSearchParams({});
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('page', newPage.toString());
      setSearchParams(newParams);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="container py-4 pb-5">
      {/* Page Title & Search Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="text-white fw-bold mb-1">Movie Catalog</h2>
          <p className="text-secondary small mb-0">
            Showing {totalCount} movies currently in database
          </p>
        </div>
        <div style={{ maxWidth: '420px', width: '100%' }}>
          <SearchBar
            onSearch={handleSearchSubmit}
            initialValue={currentSearch}
            placeholder="Search catalog..."
          />
        </div>
      </div>

      {/* Filter Panel */}
      <FilterPanel
        filters={{
          status: currentStatus,
          genre: currentGenre,
          language: currentLanguage,
          sort: currentSort,
        }}
        onFilterChange={handleFilterChange}
        availableGenres={availableGenres}
        availableLanguages={availableLanguages}
        onReset={handleResetFilters}
      />

      {/* Active Search/Filter Badges */}
      {(currentSearch || currentStatus || currentGenre || currentLanguage) && (
        <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
          <span className="text-secondary small">Active Filters:</span>
          {currentSearch && (
            <span className="badge bg-secondary text-light">
              Search: "{currentSearch}"
              <i
                className="bi bi-x ms-1 cursor-pointer"
                onClick={() => handleFilterChange('search', '')}
              ></i>
            </span>
          )}
          {currentStatus && (
            <span className="badge bg-secondary text-light">
              Status: {currentStatus}
              <i
                className="bi bi-x ms-1 cursor-pointer"
                onClick={() => handleFilterChange('status', '')}
              ></i>
            </span>
          )}
          {currentGenre && (
            <span className="badge bg-secondary text-light">
              Genre: {currentGenre}
              <i
                className="bi bi-x ms-1 cursor-pointer"
                onClick={() => handleFilterChange('genre', '')}
              ></i>
            </span>
          )}
          {currentLanguage && (
            <span className="badge bg-secondary text-light">
              Language: {currentLanguage}
              <i
                className="bi bi-x ms-1 cursor-pointer"
                onClick={() => handleFilterChange('language', '')}
              ></i>
            </span>
          )}
          <button
            className="btn btn-link btn-sm text-danger text-decoration-none p-0 ms-2"
            onClick={handleResetFilters}
          >
            Clear All
          </button>
        </div>
      )}

      {/* Movies Grid or Error / Loading */}
      {loading ? (
        <LoadingSpinner text="Searching catalogue..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={() => handlePageChange(currentPage)} />
      ) : (
        <>
          <MovieGrid
            movies={movies}
            emptyMessage="No movies match your selected filters. Try broadening your criteria."
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center align-items-center gap-2 mt-5">
              <button
                className="btn btn-cinema-secondary btn-sm"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <i className="bi bi-chevron-left me-1"></i> Prev
              </button>

              <span className="text-secondary small px-3">
                Page <strong className="text-white">{currentPage}</strong> of{' '}
                <strong className="text-white">{totalPages}</strong>
              </span>

              <button
                className="btn btn-cinema-secondary btn-sm"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next <i className="bi bi-chevron-right ms-1"></i>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Movies;
