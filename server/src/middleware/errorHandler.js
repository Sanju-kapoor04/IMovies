// Centralized error handling middleware
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error during development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error caught by handler:', err);
  }

  // Mongoose bad ObjectId (CastError)
  if (err.name === 'CastError') {
    const message = `Resource not found with id: ${err.value}`;
    return res.status(404).json({
      success: false,
      message,
    });
  }

  // Mongoose duplicate key (11000)
  if (err.code === 11000) {
    let field = Object.keys(err.keyValue || {})[0] || 'field';
    let message = `Duplicate value entered for ${field}.`;

    // Special message for seats
    if (err.keyPattern && err.keyPattern.showId && err.keyPattern.seatNumber) {
      message = 'One or more of the selected seats have already been booked by another user.';
      return res.status(409).json({
        success: false,
        message,
        conflictType: 'SEAT_ALREADY_BOOKED',
      });
    }

    if (field === 'email') {
      message = 'An account with this email address already exists.';
    }

    return res.status(409).json({
      success: false,
      message,
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      message: messages.join('. '),
      errors: messages,
    });
  }

  // Default server error (safe message, no stack trace exposed)
  const statusCode = error.statusCode || res.statusCode !== 200 ? (res.statusCode || 500) : 500;
  return res.status(statusCode >= 400 ? statusCode : 500).json({
    success: false,
    message: error.message || 'Internal Server Error. Please try again later.',
  });
};

// 404 Route Not Found
const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API Route Not Found: ${req.method} ${req.originalUrl}`,
  });
};

module.exports = { errorHandler, notFound };
