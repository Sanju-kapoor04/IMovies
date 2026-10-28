import React from 'react';
import { formatCurrency } from '../utils/formatCurrency';

const DEFAULT_POSTER = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80';

const TicketModal = ({ booking, onClose }) => {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const isCancelled = booking.status === 'CANCELLED';

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(8px)', zIndex: 1060 }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content cinema-modal-content border border-secondary border-opacity-50 shadow-lg">
          <div className="modal-header border-secondary border-opacity-25 pb-3">
            <h5 className="modal-title text-white d-flex align-items-center gap-2">
              <i className="bi bi-ticket-perforated-fill text-danger fs-4"></i>
              IMovies Cinema e-Ticket
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body p-4">
            <div className="ticket-card p-4">
              <div className="ticket-notch-left"></div>
              <div className="ticket-notch-right"></div>

              <div className="row g-4 align-items-center">
                {/* Movie Poster */}
                <div className="col-md-4 text-center">
                  <img
                    src={booking.movieId?.posterUrl || DEFAULT_POSTER}
                    alt={booking.movieId?.title}
                    className="rounded-3 shadow w-100 object-fit-cover"
                    style={{ maxHeight: '280px', maxWidth: '200px' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = DEFAULT_POSTER;
                    }}
                  />
                  <div className="mt-2 text-secondary small">
                    {booking.movieId?.duration}m &bull; {booking.movieId?.language}
                  </div>
                </div>

                {/* Ticket Details */}
                <div className="col-md-8">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="badge bg-danger text-uppercase px-2 py-1">
                      {booking.showId?.screenName || 'Standard Audi'}
                    </span>
                    <span
                      className={`badge px-3 py-1 text-uppercase ${
                        isCancelled ? 'bg-danger text-white' : 'bg-success text-white'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <h3 className="text-white fw-bold mb-1">
                    {booking.movieId?.title}
                  </h3>
                  <div className="text-danger fw-semibold small mb-3">
                    {booking.cinemaId?.name} &bull; {booking.cinemaId?.location}
                  </div>

                  <div className="row g-3 p-3 rounded-3 bg-black bg-opacity-40 border border-secondary border-opacity-25 mb-3">
                    <div className="col-6">
                      <div className="small text-secondary text-uppercase">Show Date</div>
                      <div className="fw-bold text-light">
                        {booking.showId?.showDate || 'N/A'}
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="small text-secondary text-uppercase">Show Time</div>
                      <div className="fw-bold text-warning">
                        {booking.showId?.showTime || 'N/A'}
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="small text-secondary text-uppercase">Reserved Seats</div>
                      <div className="fw-bold text-success fs-5">
                        {booking.selectedSeats?.join(', ')}
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="small text-secondary text-uppercase">Total Amount</div>
                      <div className="fw-bold text-white fs-5">
                        {formatCurrency(booking.totalAmount || 0)}
                      </div>
                    </div>
                  </div>

                  {/* Booking ID and Barcode Simulation */}
                  <div className="d-flex justify-content-between align-items-center pt-2">
                    <div>
                      <div className="small text-secondary">Booking Reference</div>
                      <div className="font-monospace text-light fw-bold fs-6">
                        {booking.bookingReference}
                      </div>
                    </div>
                    {/* Simulated barcode */}
                    <div className="text-end">
                      <div
                        className="bg-light p-1 rounded d-inline-block font-monospace text-dark px-3 py-2 fw-black"
                        style={{ letterSpacing: '4px', fontSize: '0.9rem' }}
                      >
                        ||| | |||| | ||| ||
                      </div>
                      <div className="text-muted small mt-1" style={{ fontSize: '0.7rem' }}>
                        Scan at entrance
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer border-secondary border-opacity-25 justify-content-between">
            <span className="small text-secondary">
              <i className="bi bi-info-circle me-1"></i> Present this digital ticket or printed copy at cinema counter.
            </span>
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-cinema-secondary btn-sm"
                onClick={handlePrint}
              >
                <i className="bi bi-printer me-1"></i> Print Ticket
              </button>
              <button
                type="button"
                className="btn btn-cinema-primary btn-sm"
                onClick={onClose}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketModal;
