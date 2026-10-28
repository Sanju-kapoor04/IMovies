import React, { useState } from 'react';

const SearchBar = ({ onSearch, initialValue = '', placeholder = 'Search by movie title, genre, or actor...' }) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm.trim());
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="w-100">
      <div className="input-group">
        <span className="input-group-text bg-dark border-secondary border-opacity-25 text-secondary ps-3">
          <i className="bi bi-search"></i>
        </span>
        <input
          type="text"
          className="form-control cinema-input border-start-0"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            type="button"
            className="btn btn-dark border-secondary border-opacity-25 text-secondary"
            onClick={handleClear}
            title="Clear search"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        )}
        <button className="btn btn-cinema-primary px-4" type="submit">
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
