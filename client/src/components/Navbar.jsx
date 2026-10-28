import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [navExpanded, setNavExpanded] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setNavExpanded(false);
  };

  const closeMenu = () => setNavExpanded(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-custom sticky-top">
      <div className="container">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo" onClick={closeMenu}>
          <i className="bi bi-film text-danger fs-3"></i>
          <span>I<span className="text-danger">Movies</span></span>
          <span className="brand-badge ms-1">Cinema</span>
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setNavExpanded(!navExpanded)}
        >
          <i className={`bi ${navExpanded ? 'bi-x-lg' : 'bi-list'} fs-2 text-light`}></i>
        </button>

        {/* Navigation Links */}
        <div className={`collapse navbar-collapse ${navExpanded ? 'show mt-3 mt-lg-0' : ''}`} id="navbarMain">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4 gap-lg-1">
            <li className="nav-item">
              <NavLink to="/" className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`} onClick={closeMenu}>
                <i className="bi bi-house-door"></i> Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/movies" className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`} onClick={closeMenu}>
                <i className="bi bi-camera-reels"></i> Movies
              </NavLink>
            </li>
            {isAuthenticated && (
              <li className="nav-item">
                <NavLink to="/my-bookings" className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`} onClick={closeMenu}>
                  <i className="bi bi-ticket-perforated"></i> My Bookings
                </NavLink>
              </li>
            )}
          </ul>

          {/* User Auth Actions */}
          <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
            {isAuthenticated ? (
              <div className="d-flex align-items-center gap-2">
                <Link
                  to="/profile"
                  className="d-flex align-items-center gap-2 text-decoration-none text-light bg-dark px-3 py-1 rounded-pill border border-secondary"
                  onClick={closeMenu}
                >
                  <div
                    className="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center fw-bold"
                    style={{ width: '28px', height: '28px', fontSize: '0.85rem' }}
                  >
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="small fw-semibold text-truncate" style={{ maxWidth: '120px' }}>
                    {user?.name?.split(' ')[0] || 'Profile'}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1 rounded-pill px-3"
                  title="Logout"
                >
                  <i className="bi bi-box-arrow-right"></i>
                  <span className="d-none d-sm-inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2 w-100">
                <Link to="/login" className="btn btn-cinema-secondary btn-sm flex-grow-1 flex-lg-grow-0" onClick={closeMenu}>
                  <i className="bi bi-box-arrow-in-right"></i> Sign In
                </Link>
                <Link to="/register" className="btn btn-cinema-primary btn-sm flex-grow-1 flex-lg-grow-0" onClick={closeMenu}>
                  <i className="bi bi-person-plus"></i> Join Now
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
