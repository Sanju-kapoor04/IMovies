import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer-custom">
      <div className="container">
        <div className="row g-4 mb-4">
          {/* Brand Info */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <i className="bi bi-film text-danger fs-3"></i>
              <span className="brand-title fs-4 text-white">
                I<span className="text-danger">Movies</span>
              </span>
            </div>
            <p className="text-secondary small pe-lg-4">
              Movie Ticket Booking Made Simple. Experience seamless cinema seat selection, instant reservations, and state-of-the-art audiovisual entertainment.
            </p>
            <div className="d-flex gap-3 text-secondary mt-3">
              <span className="badge bg-secondary bg-opacity-25 text-light border border-secondary border-opacity-25 p-2">
                <i className="bi bi-shield-check text-success me-1"></i> Concurrency Safe
              </span>
              <span className="badge bg-secondary bg-opacity-25 text-light border border-secondary border-opacity-25 p-2">
                <i className="bi bi-lightning-charge text-warning me-1"></i> Instant Tickets
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="text-white text-uppercase fw-bold mb-3 small tracking-wider">Navigation</h6>
            <ul className="list-unstyled">
              <li><Link to="/" className="footer-link small">Home</Link></li>
              <li><Link to="/movies" className="footer-link small">Browse Movies</Link></li>
              <li><Link to="/movies?status=NOW_SHOWING" className="footer-link small">Now Showing</Link></li>
              <li><Link to="/movies?status=UPCOMING" className="footer-link small">Upcoming Releases</Link></li>
              <li><Link to="/my-bookings" className="footer-link small">My Bookings</Link></li>
            </ul>
          </div>

          {/* Cinemas & Formats */}
          <div className="col-lg-3 col-md-6 col-6">
            <h6 className="text-white text-uppercase fw-bold mb-3 small tracking-wider">Cinemas & Tech</h6>
            <ul className="list-unstyled">
              <li><span className="footer-link small text-muted">IMAX with Laser 3D</span></li>
              <li><span className="footer-link small text-muted">Dolby Atmos Audio</span></li>
              <li><span className="footer-link small text-muted">4K RGB Projection</span></li>
              <li><span className="footer-link small text-muted">VIP Luxe Recliners</span></li>
            </ul>
          </div>

          {/* Project & Evaluation Info */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-white text-uppercase fw-bold mb-3 small tracking-wider">Academic Portfolio</h6>
            <p className="text-secondary small mb-2">
              Full-Stack MERN Architecture with atomic seat booking, JWT authentication, and MongoDB ODM.
            </p>
            <div className="p-2 rounded bg-dark border border-secondary border-opacity-25 small text-secondary">
              <i className="bi bi-info-circle text-info me-1"></i> Demo booking mode active. No actual payments or banking info collected.
            </div>
          </div>
        </div>

        <hr className="border-secondary border-opacity-25 my-4" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 text-secondary small">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} IMovies Platform. Crafted for technical excellence and portfolio evaluation.
          </p>
          <div className="d-flex gap-3">
            <span className="text-muted">Privacy Policy</span>
            <span className="text-muted">&bull;</span>
            <span className="text-muted">Terms of Service</span>
            <span className="text-muted">&bull;</span>
            <span className="text-muted">Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
