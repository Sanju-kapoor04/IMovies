const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Movie description is required'],
      trim: true,
    },
    genre: {
      type: [String],
      required: [true, 'At least one genre is required'],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'A movie must have at least one genre',
      },
    },
    language: {
      type: String,
      required: [true, 'Language is required'],
      trim: true,
      index: true,
    },
    duration: {
      type: Number, // In minutes
      required: [true, 'Duration in minutes is required'],
      min: [1, 'Duration must be at least 1 minute'],
    },
    rating: {
      type: Number, // 0 to 10
      required: [true, 'Rating is required'],
      min: [0, 'Rating cannot be less than 0'],
      max: [10, 'Rating cannot exceed 10'],
      default: 8.0,
    },
    posterUrl: {
      type: String,
      required: [true, 'Poster URL is required'],
      trim: true,
    },
    backdropUrl: {
      type: String,
      required: [true, 'Backdrop URL is required'],
      trim: true,
    },
    cast: {
      type: [String],
      default: [],
    },
    director: {
      type: String,
      trim: true,
      default: '',
    },
    trailerUrl: {
      type: String,
      trim: true,
      default: '',
    },
    releaseDate: {
      type: Date,
      required: [true, 'Release date is required'],
    },
    status: {
      type: String,
      enum: ['NOW_SHOWING', 'UPCOMING', 'ARCHIVED'],
      default: 'NOW_SHOWING',
      index: true,
    },
    isTrending: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Text index for search
movieSchema.index(
  { title: 'text', description: 'text', cast: 'text' },
  { default_language: 'english', language_override: 'textSearchLanguage' }
);

const Movie = mongoose.model('Movie', movieSchema);
module.exports = Movie;
