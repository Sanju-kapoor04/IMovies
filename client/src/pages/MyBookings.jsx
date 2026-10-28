import React, { useState, useEffect } from 'react';
import BookingCard from '../components/BookingCard';
import TicketModal from '../components/TicketModal';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import { bookingService } from '../services/bookingService';
import { formatCurrency } from '../utils/formatCurrency';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelModalBooking, setCancelModalBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState('Change of plans');
  const [actionSuccess, setActionSuccess] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bookingService.getMyBookings();
      setBookings(data || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load your bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleOpenCancelModal = (bookingId) => {
    const booking = bookings.find((b) => b._id === bookingId);
    setCancelModalBooking(booking);
  };

  const handleConfirmCancel = async () => {
    if (!cancelModalBooking) return;

    try {
      setCancellingId(cancelModalBooking._id);
      await bookingService.cancelBooking(cancelModalBooking._id, cancelReason);

      // Refresh state
      setBookings((prev) =>
        prev.map((b) =>
          b._id === cancelModalBooking._id
            ? { ...b, status: 'CANCELLED', cancelledAt: new Date() }
            : b
        )
      );

      setActionSuccess(
        `Booking ${cancelModalBooking.bookingReference} was cancelled successfully. Seats have been returned to inventory.`
      );
      setCancelModalBooking(null);
    } catch (err) {
      console.error('Cancellation failed:', err);
      alert(err.response?.data?.message || 'Could not cancel booking.');
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading your cinema reservations..." />;
  }

  return (
    <div className="container py-4 pb-5">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="text-white fw-bold mb-1">My Cinema Bookings</h2>
          <p className="text-secondary small mb-0">
            View tickets, barcodes, and manage upcoming show reservations.
          </p>
        </div>
        <button
          onClick={fetchBookings}
          className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
        >
          <i className="bi bi-arrow-clockwise"></i> Refresh
        </button>
      </div>

      {/* Success Notification Alert */}
      {actionSuccess && (
        <div className="alert alert-success bg-success bg-opacity-20 border border-success text-white rounded-3 p-3 mb-4 d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-check-circle-fill text-success fs-5"></i>
            <span>{actionSuccess}</span>
          </div>
          <button
            type="button"
            className="btn-close btn-close-white"
            onClick={() => setActionSuccess(null)}
          ></button>
        </div>
      )}

      {error ? (
        <ErrorMessage message={error} onRetry={fetchBookings} />
      ) : bookings.length === 0 ? (
        <EmptyState
          icon="bi-ticket-perforated"
          title="No Bookings Yet"
          description="You haven't reserved any cinema tickets yet. Explore current blockbusters and pick your favourite seats!"
          actionText="Browse Now Showing"
          actionLink="/movies"
        />
      ) : (
        <div className="d-flex flex-column gap-3">
          {bookings.map((booking) => (
            <BookingCard
              key={booking._id}
              booking={booking}
              onViewDetails={() => setSelectedTicket(booking)}
              onCancelBooking={() => handleOpenCancelModal(booking._id)}
              cancelling={cancellingId === booking._id}
            />
          ))}
        </div>
      )}

      {/* Digital e-Ticket View Modal */}
      {selectedTicket && (
        <TicketModal
          booking={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}

      {/* Cancellation Confirmation Modal */}
      {cancelModalBooking && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content cinema-modal-content">
              <div className="modal-header border-secondary border-opacity-25">
                <h5 className="modal-title text-white">
                  <i className="bi bi-exclamation-triangle text-danger me-2"></i>
                  Cancel Booking Confirmation
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setCancelModalBooking(null)}
                ></button>
              </div>

              <div className="modal-body p-4">
                <p className="text-secondary small mb-3">
                  Are you sure you want to cancel this booking? Once cancelled, your seats (
                  <strong className="text-danger">
                    {cancelModalBooking.selectedSeats?.join(', ')}
                  </strong>
                  ) will be immediately released back to other cinema goers.
                </p>

                <div className="mb-3">
                  <label className="form-label text-secondary small fw-semibold">
                    Reason for Cancellation
                  </label>
                  <select
                    className="form-select cinema-input form-select-sm"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                  >
                    <option value="Change of plans">Change of plans</option>
                    <option value="Booked incorrect showtime">Booked incorrect showtime</option>
                    <option value="Illness or emergency">Illness or emergency</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="p-3 rounded-3 bg-dark bg-opacity-75 border border-secondary border-opacity-25 small text-secondary">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span>Refund Amount:</span>
                    <strong className="text-white fs-6">
                      {formatCurrency(cancelModalBooking.totalAmount || 0)}
                    </strong>
                  </div>
                  <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                    <i className="bi bi-info-circle text-info me-1"></i>
                    Eligible for full refund and instant seat release before show start time.
                  </div>
                </div>
              </div>

              <div className="modal-footer border-secondary border-opacity-25">
                <button
                  type="button"
                  className="btn btn-cinema-secondary btn-sm"
                  onClick={() => setCancelModalBooking(null)}
                >
                  Keep Booking
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={handleConfirmCancel}
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
