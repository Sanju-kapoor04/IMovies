import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import SeatLayout from '../components/SeatLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { movieService } from '../services/movieService';
import { bookingService } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatCurrency';

const SeatSelection = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [showData, setShowData] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const fetchSeats = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const data = await movieService.getShowSeats(showId);
      setShowData(data);
    } catch (err) {
      console.error('Error fetching seat layout:', err);
      setErrorMessage(
        err.response?.data?.message || 'Failed to load seat availability. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeats();
  }, [showId]);

  const handleToggleSeat = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
    } else {
      if (selectedSeats.length >= 10) {
        alert('You can select a maximum of 10 seats per booking.');
        return;
      }
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleProceedClick = () => {
    if (!isAuthenticated) {
      // Direct user to login preserving seat selection state
      navigate('/login', {
        state: {
          from: `/shows/${showId}/seats`,
          message: 'Please sign in to confirm and complete your seat reservation.',
        },
      });
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmReservation = async () => {
    try {
      setBookingInProgress(true);
      setErrorMessage(null);

      const payload = {
        showId,
        selectedSeats,
      };

      const result = await bookingService.createBooking(payload);

      // Successfully booked! Navigate to confirmation page
      navigate(`/booking-confirmation/${result.booking._id}`, {
        state: { booking: result.booking },
      });
    } catch (err) {
      console.error('Booking failed:', err);
      const msg =
        err.response?.data?.message ||
        'Reservation conflict: One or more selected seats were booked by another user. Please choose alternative seats.';
      setErrorMessage(msg);
      setShowConfirmModal(false);

      // Re-fetch seat layout so booked seats update instantly
      fetchSeats();
      // Remove any conflicting seats from selection
      if (err.response?.data?.unavailableSeats) {
        setSelectedSeats((prev) =>
          prev.filter((s) => !err.response.data.unavailableSeats.includes(s))
        );
      }
    } finally {
      setBookingInProgress(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Fetching real-time seat matrix..." />;
  }

  if (errorMessage && !showData) {
    return (
      <div className="container py-5">
        <ErrorMessage message={errorMessage} onRetry={fetchSeats} />
      </div>
    );
  }

  return (
    <div className="seat-selection-page py-4 pb-5">
      <div className="container">
        {/* Breadcrumb Navigation */}
        <div className="d-flex align-items-center gap-2 small text-secondary mb-3">
          <Link to="/" className="text-secondary text-decoration-none">Home</Link>
          <span>/</span>
          <Link to={`/movies/${showData?.movie?._id}`} className="text-secondary text-decoration-none">
            {showData?.movie?.title}
          </Link>
          <span>/</span>
          <span className="text-white">Seat Selection</span>
        </div>

        {/* Header Bar */}
        <div className="p-4 rounded-4 bg-dark bg-opacity-75 border border-secondary border-opacity-50 mb-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="badge bg-danger text-uppercase px-2 py-1">
                {showData?.screenName}
              </span>
              <span className="text-secondary small">
                {showData?.movie?.language} &bull; {showData?.movie?.duration}m
              </span>
            </div>
            <h3 className="text-white fw-bold mb-1">{showData?.movie?.title}</h3>
            <div className="text-secondary small">
              <i className="bi bi-geo-alt-fill text-danger me-1"></i>
              {showData?.cinema?.name} &bull; {showData?.cinema?.location}
            </div>
          </div>

          <div className="text-md-end bg-black bg-opacity-40 p-3 rounded-3 border border-secondary border-opacity-25">
            <div className="small text-secondary">Date & Showtime</div>
            <div className="fs-5 fw-bold text-warning">{showData?.showTime}</div>
            <div className="small text-light fw-medium">{showData?.showDate}</div>
          </div>
        </div>

        {/* Error notification banner if booking conflict happens */}
        {errorMessage && (
          <div className="alert alert-danger bg-danger bg-opacity-15 border border-danger text-white rounded-3 p-3 mb-4 d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-exclamation-octagon-fill text-danger fs-4"></i>
              <span>{errorMessage}</span>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={() => setErrorMessage(null)}
            ></button>
          </div>
        )}

        {/* Interactive Cinema Seat Map */}
        <div className="p-4 rounded-4 bg-dark bg-opacity-50 border border-secondary border-opacity-25">
          <SeatLayout
            layout={showData?.layout}
            bookedSeats={showData?.bookedSeats}
            selectedSeats={selectedSeats}
            ticketPrice={showData?.ticketPrice}
            vipPrice={showData?.vipPrice}
            onToggleSeat={handleToggleSeat}
            onProceed={handleProceedClick}
            disabled={bookingInProgress}
          />
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content cinema-modal-content">
              <div className="modal-header border-secondary border-opacity-25">
                <h5 className="modal-title text-white">Confirm Ticket Order</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowConfirmModal(false)}
                  disabled={bookingInProgress}
                ></button>
              </div>
              <div className="modal-body p-4">
                <p className="text-secondary small mb-3">
                  Please review your reservation details before confirming.
                </p>

                <div className="p-3 rounded-3 bg-black bg-opacity-40 border border-secondary border-opacity-25 mb-3">
                  <div className="d-flex justify-content-between py-1 text-secondary small">
                    <span>Movie:</span>
                    <strong className="text-white">{showData?.movie?.title}</strong>
                  </div>
                  <div className="d-flex justify-content-between py-1 text-secondary small">
                    <span>Venue:</span>
                    <strong className="text-white">{showData?.cinema?.name}</strong>
                  </div>
                  <div className="d-flex justify-content-between py-1 text-secondary small">
                    <span>Screen:</span>
                    <strong className="text-white">{showData?.screenName}</strong>
                  </div>
                  <div className="d-flex justify-content-between py-1 text-secondary small">
                    <span>Time:</span>
                    <strong className="text-warning">{showData?.showDate} at {showData?.showTime}</strong>
                  </div>
                  <div className="d-flex justify-content-between py-1 text-secondary small">
                    <span>Seats:</span>
                    <strong className="text-success">{selectedSeats.join(', ')}</strong>
                  </div>
                  <div className="d-flex justify-content-between py-1 text-secondary small">
                    <span>Total Amount:</span>
                    <strong className="text-white fs-6">
                      {formatCurrency(
                        selectedSeats.reduce((acc, seat) => {
                          const isVip = (showData?.layout?.vipRows || ['G', 'H']).includes(seat.charAt(0));
                          return acc + (isVip ? (showData?.vipPrice || 380) : (showData?.ticketPrice || 220));
                        }, 0)
                      )}
                    </strong>
                  </div>
                </div>

                <div className="alert alert-info bg-info bg-opacity-10 border border-info border-opacity-25 text-light small mb-0">
                  <i className="bi bi-info-circle-fill text-info me-1"></i>
                  <strong>Demo Checkout Mode:</strong> No real money or card details required. Seats will be atomically locked to your account upon confirmation.
                </div>
              </div>

              <div className="modal-footer border-secondary border-opacity-25">
                <button
                  type="button"
                  className="btn btn-cinema-secondary btn-sm"
                  onClick={() => setShowConfirmModal(false)}
                  disabled={bookingInProgress}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-cinema-primary btn-sm"
                  onClick={handleConfirmReservation}
                  disabled={bookingInProgress}
                >
                  {bookingInProgress ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Reserving Seats...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check2-circle me-1"></i> Confirm & Book
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatSelection;
