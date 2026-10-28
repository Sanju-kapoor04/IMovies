const mongoose = require('mongoose');

const showSchema = new mongoose.Schema(
  {
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: [true, 'Movie reference is required'],
      index: true,
    },
    cinemaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cinema',
      required: [true, 'Cinema reference is required'],
      index: true,
    },
    screenName: {
      type: String,
      required: [true, 'Screen name is required'],
    },
    showDate: {
      type: String, // 'YYYY-MM-DD' format for clean date querying
      required: [true, 'Show date is required'],
      index: true,
    },
    showTime: {
      type: String, // e.g. '07:30 PM'
      required: [true, 'Show time is required'],
    },
    startTime: {
      type: Date, // Full UTC timestamp of show start time
      required: [true, 'Start timestamp is required'],
      index: true,
    },
    ticketPrice: {
      type: Number,
      required: [true, 'Ticket price is required'],
      min: [0, 'Ticket price cannot be negative'],
    },
    vipPrice: {
      type: Number,
      default: function () {
        return Math.round(this.ticketPrice * 1.4);
      },
    },
    totalSeats: {
      type: Number,
      default: 80,
    },
    bookedSeats: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'CANCELLED'],
      default: 'ACTIVE',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for finding shows by movie, cinema, date
showSchema.index({ movieId: 1, cinemaId: 1, showDate: 1 });
showSchema.index({ startTime: 1, status: 1 });

const Show = mongoose.model('Show', showSchema);
module.exports = Show;
