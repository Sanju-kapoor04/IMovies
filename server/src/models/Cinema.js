const mongoose = require('mongoose');

const screenSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  totalSeats: {
    type: Number,
    required: true,
    default: 80,
  },
  rows: {
    type: [String],
    default: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
  },
  seatsPerRow: {
    type: Number,
    default: 10,
  },
  vipRows: {
    type: [String],
    default: ['F', 'G', 'H'],
  },
});

const cinemaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Cinema name is required'],
      trim: true,
      index: true,
    },
    location: {
      type: String,
      required: [true, 'Location address is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      index: true,
    },
    facilities: {
      type: [String],
      default: ['Dolby Atmos', '4K Projection', 'Recliner Seats', 'Gourmet Food'],
    },
    screens: [screenSchema],
  },
  {
    timestamps: true,
  }
);

const Cinema = mongoose.model('Cinema', cinemaSchema);
module.exports = Cinema;
