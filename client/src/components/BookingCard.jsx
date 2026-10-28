import React from 'react';

const DEFAULT_POSTER = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80';

const BookingCard = ({ booking, onViewDetails, onCancelBooking, cancelling = false }) => {
  const isCancelled = booking.status === 'CANCELLED';
  const showDate = booking.showId?.showDate || 'N/A';
  const showTime = booking.showId?.showTime || 'N/A';
  const startTime = booking.showId?.startTime ? new Date(booking.showId.startTime) : null;
  const isPastShow = startTime ? new Date() > startTime : false;
  const canCancel = !isCancelled && !isPastShow;

  return (
    <div className="card bg-dark bg-opacity-75 border border-secondary border-opacity-25 rounded-4 overflow-hidden mb-3 shadow-sm hover-elevate transition-all">
      <div className="row g-0">
        {/* Movie Poster Thumbnail */}
        <div className="col-4 col-sm-3 col-md-2" style={{ maxHeight: '220px' }}>
          <img
            src={booking.movieId?.posterUrl || DEFAULT_POSTER}
            alt={booking.movieId?.title || 'Movie Poster'}
            className="w-100 h-100 object-fit-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = DEFAULT_POSTER;
            }}
          />
        </div>

        {/* Booking Details */}
        <div className="col-8 col-sm-9 col-md-10 p-3 d-flex flex-column justify-content-between">
          <div>
            <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-2">
              <div>
                <h5 className="text-white fw-bold mb-1">
                  {booking.movieId?.title || 'Movie'}
                </h5>
                <div className="small text-secondary">
                  Ref: <span className="font-monospace text-light">{booking.bookingReference}</span>
                </div>
              </div>

              {/* Status Badge */}
              <span
                className={`badge px-3 py-2 text-uppercase fw-bold ${
                  isCancelled
                    ? 'bg-danger bg-opacity-25 text-danger border border-danger border-opacity-50'
                    : 'bg-success bg-opacity-25 text-success border border-success border-opacity-50'
                }`}
              >
                <i className={`bi ${isCancelled ? 'bi-x-circle' : 'bi-check-circle'} me-1`}></i>
                {booking.status}
              </span>
            </div>

            <div className="row g-2 text-secondary small my-2">
              <div className="col-sm-6">
                <div>
                  <i className="bi bi-geo-alt text-danger me-1"></i>
                  <span className="text-light fw-medium">{booking.cinemaId?.name || 'Cinema'}</span>
                  {booking.showId?.screenName && ` (${booking.showId.screenName})`}
                </div>
                <div className="text-muted ms-3">
                  {booking.cinemaId?.city || 'Cinema City'}
                </div>
              </div>

              <div className="col-sm-6">
                <div>
                  <i className="bi bi-calendar-event text-info me-1"></i>
                  <span className="text-light fw-medium">{showDate}</span> at{' '}
                  <span className="text-light fw-medium">{showTime}</span>
                </div>
                <div>
                  <i className="bi bi-ticket text-warning me-1"></i>
                  Seats:{' '}
                  <span className="text-white fw-bold">
                    {booking.selectedSeats?.join(', ') || 'N/A'}
                  </span>
                  <span className="text-muted ms-1">({booking.numberOfTickets} tickets)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer of Card with Price & Actions */}
          <div className="d-flex flex-wrap justify-content-between align-items-center pt-3 border-top border-secondary border-opacity-25 mt-2 gap-2">
            <div>
              <span className="small text-secondary me-2">Total Paid:</span>
              <span className="fs-5 fw-bold text-white">
                ${booking.totalAmount ? booking.totalAmount.toFixed(2) : '0.00'}
              </span>
              <span className="badge bg-secondary bg-opacity-25 text-light ms-2 small">Demo</span>
            </div>

            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-sm btn-cinema-secondary"
                onClick={() => onViewDetails(booking)}
              >
                <i className="bi bi-ticket-perforated me-1"></i> View Ticket
              </button>

              {canCancel && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  disabled={cancelling}
                  onClick={() => onCancelBooking(booking._id)}
                >
                  <i className="bi bi-x-circle me-1"></i>
                  {cancelling ? 'Cancelling...' : 'Cancel Booking'}
                </button>
              )}

              {isPastShow && !isCancelled && (
                <span className="badge bg-secondary bg-opacity-25 text-muted align-self-center py-2 px-3">
                  Show Concluded
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
