import React from 'react';

const FilterPanel = ({
  filters,
  onFilterChange,
  availableGenres = [],
  availableLanguages = [],
  onReset,
}) => {
  return (
    <div className="p-3 rounded-3 bg-dark bg-opacity-50 border border-secondary border-opacity-25 mb-4">
      <div className="row g-3 align-items-center">
        {/* Status Filter */}
        <div className="col-12 col-md-3">
          <label className="form-label text-secondary small fw-semibold mb-1">
            Release Status
          </label>
          <select
            className="form-select cinema-input form-select-sm"
            value={filters.status || ''}
            onChange={(e) => onFilterChange('status', e.target.value)}
          >
            <option value="">All Movies</option>
            <option value="NOW_SHOWING">Now Showing</option>
            <option value="UPCOMING">Upcoming Releases</option>
          </select>
        </div>

        {/* Genre Filter */}
        <div className="col-12 col-md-3">
          <label className="form-label text-secondary small fw-semibold mb-1">
            Genre
          </label>
          <select
            className="form-select cinema-input form-select-sm"
            value={filters.genre || ''}
            onChange={(e) => onFilterChange('genre', e.target.value)}
          >
            <option value="">All Genres</option>
            {availableGenres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        {/* Language Filter */}
        <div className="col-12 col-md-3">
          <label className="form-label text-secondary small fw-semibold mb-1">
            Language
          </label>
          <select
            className="form-select cinema-input form-select-sm"
            value={filters.language || ''}
            onChange={(e) => onFilterChange('language', e.target.value)}
          >
            <option value="">All Languages</option>
            {availableLanguages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By & Reset */}
        <div className="col-12 col-md-3 d-flex align-items-end gap-2">
          <div className="flex-grow-1">
            <label className="form-label text-secondary small fw-semibold mb-1">
              Sort By
            </label>
            <select
              className="form-select cinema-input form-select-sm"
              value={filters.sort || ''}
              onChange={(e) => onFilterChange('sort', e.target.value)}
            >
              <option value="rating">Top Rated</option>
              <option value="releaseDate">Newest First</option>
              <option value="title">Alphabetical (A-Z)</option>
            </select>
          </div>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
            onClick={onReset}
            title="Reset all filters"
            style={{ height: '31px' }}
          >
            <i className="bi bi-arrow-counterclockwise"></i>
            <span className="d-none d-lg-inline">Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
