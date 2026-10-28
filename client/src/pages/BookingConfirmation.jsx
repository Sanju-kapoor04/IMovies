import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { bookingService } from '../services/bookingService';

const DEFAULT_POSTER = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80';

const BookingConfirmation = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(location.state?.booking || null);
  const [loading, setLoading] = useState(!location.state?.booking);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!booking) {
      const fetchBooking = async () => {
        try {
          setLoading(true);
          const data = await bookingService.getBookingById(id);
          setBooking(data);
        } catch (err) {
          console.error('Failed to load booking:', err);
          setError('Could not locate this booking confirmation.');
        } finally {
          setLoading(false);
        }
      };
      fetchBooking();
    }
  }, [id, booking]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <LoadingSpinner text="Retrieving your confirmed ticket..." />;
  }

  if (error || !booking) {
    return (
      <div className="container py-5">
        <ErrorMessage message={error || 'Booking record not found.'} />
        <div className="text-center mt-3">
          <Link to="/my-bookings" className="btn btn-cinema-primary">
            View My Bookings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Success Banner */}
      <div className="text-center mb-5 animate-fade-in">
        <div
          className="d-inline-flex align-items-center justify-content-center rounded-circle bg-success bg-opacity-25 text-success border border-success border-opacity-50 mb-3 shadow"
          style={{ width: '80px', height: '80px' }}
        >
          <i className="bi bi-check-lg" style={{ fontSize: '3rem' }}></i>
        </div>
        <h2 className="text-white fw-bold mb-2">Booking Confirmed!</h2>
        <p className="text-secondary small mx-auto" style={{ maxWidth: '520px' }}>
          Your tickets have been reserved in the cinema system. Present your booking reference or e-ticket at the cinema entrance.
        </p>
      </div>

      {/* Ticket Container */}
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="ticket-card p-4 p-md-5">
            <div className="ticket-notch-left"></div>
            <div className="ticket-notch-right"></div>

            <div className="row g-4 align-items-center">
              {/* Poster */}
              <div className="col-md-4 text-center">
                <img
                  src={booking.movieId?.posterUrl || DEFAULT_POSTER}
                  alt={booking.movieId?.title}
                  className="rounded-4 shadow w-100 object-fit-cover"
                  style={{ maxHeight: '300px', maxWidth: '220px' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = DEFAULT_POSTER;
                  }}
                />
              </div>

              {/* Ticket Details */}
              <div className="col-md-8">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="badge bg-danger text-uppercase px-2 py-1">
                    {booking.showId?.screenName || 'Screen 1'}
                  </span>
                  <span className="badge bg-success bg-opacity-25 text-success border border-success px-3 py-1">
                    <i className="bi bi-shield-check me-1"></i> {booking.status}
                  </span>
                </div>

                <h3 className="text-white fw-bold mb-1">{booking.movieId?.title}</h3>
                <div className="text-danger fw-semibold small mb-3">
                  <i className="bi bi-geo-alt-fill me-1"></i>
                  {booking.cinemaId?.name} &bull; {booking.cinemaId?.location}
                </div>

                <div className="p-3 rounded-3 bg-black bg-opacity-40 border border-secondary border-opacity-25 mb-3">
                  <div className="row g-2 text-secondary small">
                    <div className="col-6">
                      <div className="text-uppercase" style={{ fontSize: '0.72rem' }}>Show Date</div>
                      <div className="fw-bold text-light fs-6">
                        {booking.showId?.showDate || 'N/A'}
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="text-uppercase" style={{ fontSize: '0.72rem' }}>Show Time</div>
                      <div className="fw-bold text-warning fs-6">
                        {booking.showId?.showTime || 'N/A'}
                      </div>
                    </div>
                    <div className="col-6 mt-2">
                      <div className="text-uppercase" style={{ fontSize: '0.72rem' }}>Confirmed Seats</div>
                      <div className="fw-bold text-success fs-5">
                        {booking.selectedSeats?.join(', ')}
                      </div>
                    </div>
                    <div className="col-6 mt-2">
                      <div className="text-uppercase" style={{ fontSize: '0.72rem' }}>Total Amount Paid</div>
                      <div className="fw-bold text-white fs-5">
                        ${booking.totalAmount ? booking.totalAmount.toFixed(2) : '0.00'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reference ID & Simulated Barcode */}
                <div className="d-flex justify-content-between align-items-end pt-2">
                  <div>
                    <div className="small text-secondary">Booking Reference</div>
                    <div className="font-monospace text-light fw-bold fs-5">
                      {booking.bookingReference}
                    </div>
                  </div>
                  <div className="text-end">
                    <div
                      className="bg-light p-1 rounded d-inline-block font-monospace text-dark px-3 py-1 fw-black"
                      style={{ letterSpacing: '4px', fontSize: '0.9rem' }}
                    >
                      |||| | ||||| | ||
                    </div>
                    <div className="text-secondary small mt-1" style={{ fontSize: '0.7rem' }}>
                      Scan at entry gate
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">
            <button type="button" className="btn btn-cinema-secondary" onClick={handlePrint}>
              <i className="bi bi-printer me-1"></i> Print / Save Ticket
            </button>
            <Link to="/my-bookings" className="btn btn-cinema-primary">
              <i className="bi bi-ticket-perforated me-1"></i> View All My Bookings
            </Link>
            <Link to="/movies" className="btn btn-outline-secondary">
              <i className="bi bi-camera-reels me-1"></i> Explore More Movies
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
