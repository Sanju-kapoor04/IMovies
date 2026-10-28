const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    showId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show',
      required: true,
      index: true,
    },
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: true,
    },
    cinemaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cinema',
      required: true,
    },
    selectedSeats: {
      type: [String],
      required: true,
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'At least one seat must be selected',
      },
    },
    numberOfTickets: {
      type: Number,
      required: true,
      min: [1, 'Number of tickets must be at least 1'],
    },
    ticketPrice: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: [0, 'Total amount cannot be negative'],
    },
    paymentDetails: {
      method: {
        type: String,
        default: 'DEMO_INSTANT_CONFIRMATION',
      },
      status: {
        type: String,
        enum: ['DEMO_COMPLETED', 'PENDING', 'FAILED', 'REFUNDED'],
        default: 'DEMO_COMPLETED',
      },
      note: {
        type: String,
        default: 'Demo booking flow - no real money was charged.',
      },
    },
    status: {
      type: String,
      enum: ['CONFIRMED', 'CANCELLED'],
      default: 'CONFIRMED',
      index: true,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
    cancellationReason: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
bookingSchema.index({ userId: 1, createdAt: -1 });
bookingSchema.index({ showId: 1, status: 1 });

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
