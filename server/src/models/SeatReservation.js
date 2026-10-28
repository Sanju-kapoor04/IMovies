const mongoose = require('mongoose');

const seatReservationSchema = new mongoose.Schema(
  {
    showId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show',
      required: true,
      index: true,
    },
    seatNumber: {
      type: String,
      required: true,
      trim: true,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// CRITICAL UNIQUE COMPOUND INDEX:
// Guarantees that at the database storage engine level, no two records
// can EVER exist for the same showId and seatNumber!
seatReservationSchema.index({ showId: 1, seatNumber: 1 }, { unique: true });

const SeatReservation = mongoose.model('SeatReservation', seatReservationSchema);
module.exports = SeatReservation;
