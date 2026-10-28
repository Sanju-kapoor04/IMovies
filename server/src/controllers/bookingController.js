const Booking = require('../models/Booking');
const Show = require('../models/Show');
const Cinema = require('../models/Cinema');
const SeatReservation = require('../models/SeatReservation');

// Helper to generate professional, unique booking reference
const generateBookingReference = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `IMOV-${timestamp}-${randomPart}`;
};

// @desc    Create a new booking with concurrency-safe seat reservation
// @route   POST /api/bookings
// @access  Private (protect)
const createBooking = async (req, res, next) => {
  const { showId, selectedSeats } = req.body;
  const userId = req.user._id;

  // 1. Basic validation
  if (!showId) {
    return res.status(400).json({
      success: false,
      message: 'Show ID is required.',
    });
  }

  if (
    !selectedSeats ||
    !Array.isArray(selectedSeats) ||
    selectedSeats.length === 0
  ) {
    return res.status(400).json({
      success: false,
      message: 'Please select at least one seat to book.',
    });
  }

  if (selectedSeats.length > 10) {
    return res.status(400).json({
      success: false,
      message: 'You cannot book more than 10 seats in a single order.',
    });
  }

  // Sanitize and deduplicate selected seats in the request
  const cleanSeats = Array.from(
    new Set(selectedSeats.map((s) => String(s).trim().toUpperCase()))
  );

  if (cleanSeats.length !== selectedSeats.length) {
    return res.status(400).json({
      success: false,
      message: 'Duplicate seats specified in your selection.',
    });
  }

  try {
    // 2. Fetch and validate show
    const show = await Show.findById(showId)
      .populate('movieId')
      .populate('cinemaId');

    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'The requested show was not found.',
      });
    }

    if (show.status !== 'ACTIVE') {
      return res.status(400).json({
        success: false,
        message: 'This show is no longer active for booking.',
      });
    }

    // 3. Prevent booking past shows
    const now = new Date();
    if (new Date(show.startTime) <= now) {
      return res.status(400).json({
        success: false,
        message: 'Cannot book tickets for a show that has already started or passed.',
      });
    }

    // 4. Check against currently booked seats in memory first
    const alreadyBooked = cleanSeats.filter((seat) =>
      show.bookedSeats.includes(seat)
    );
    if (alreadyBooked.length > 0) {
      return res.status(409).json({
        success: false,
        message: `Seat(s) ${alreadyBooked.join(', ')} are already booked. Please choose other seats.`,
        unavailableSeats: alreadyBooked,
      });
    }

    // 5. Calculate total server-side
    // Check vip rows if configured in cinema
    let vipRows = ['G', 'H'];
    if (show.cinemaId && show.cinemaId.screens) {
      const screen = show.cinemaId.screens.find(
        (s) => s.name === show.screenName
      );
      if (screen && screen.vipRows && screen.vipRows.length > 0) {
        vipRows = screen.vipRows;
      }
    }

    let calculatedTotal = 0;
    cleanSeats.forEach((seat) => {
      const rowLetter = seat.charAt(0);
      const isVip = vipRows.includes(rowLetter);
      const price = isVip ? show.vipPrice : show.ticketPrice;
      calculatedTotal += price;
    });

    // 6. Generate booking reference
    const bookingReference = generateBookingReference();

    // 7. Atomic reservation strategy:
    // First, attempt atomic findOneAndUpdate on Show to claim the seats
    const updatedShow = await Show.findOneAndUpdate(
      {
        _id: show._id,
        status: 'ACTIVE',
        bookedSeats: { $nin: cleanSeats }, // Guarantee NONE of these seats are currently booked
      },
      {
        $addToSet: { bookedSeats: { $each: cleanSeats } },
      },
      { new: true }
    );

    if (!updatedShow) {
      return res.status(409).json({
        success: false,
        message:
          'One or more selected seats were just reserved by another customer. Please choose different seats.',
      });
    }

    // 8. Create the booking document
    let booking;
    try {
      booking = await Booking.create({
        bookingReference,
        userId,
        showId: show._id,
        movieId: show.movieId._id,
        cinemaId: show.cinemaId._id,
        selectedSeats: cleanSeats,
        numberOfTickets: cleanSeats.length,
        ticketPrice: show.ticketPrice,
        totalAmount: calculatedTotal,
        status: 'CONFIRMED',
        paymentDetails: {
          method: 'DEMO_INSTANT_CONFIRMATION',
          status: 'DEMO_COMPLETED',
          note: 'Demo booking flow - no real money was charged.',
        },
      });

      // 9. Insert individual seat reservations for strict unique index enforcement
      const seatDocs = cleanSeats.map((seat) => ({
        showId: show._id,
        seatNumber: seat,
        bookingId: booking._id,
        userId,
      }));

      await SeatReservation.insertMany(seatDocs);
    } catch (createErr) {
      // Rollback show seats if booking or seat reservation fails
      await Show.findByIdAndUpdate(show._id, {
        $pull: { bookedSeats: { $in: cleanSeats } },
      });

      if (booking && booking._id) {
        await Booking.findByIdAndDelete(booking._id);
      }
      await SeatReservation.deleteMany({
        showId: show._id,
        seatNumber: { $in: cleanSeats },
      });

      if (createErr.code === 11000) {
        return res.status(409).json({
          success: false,
          message:
            'Concurrency conflict: One or more selected seats were reserved simultaneously by another transaction. Please try again.',
        });
      }
      throw createErr;
    }

    // Populate for response
    const populatedBooking = await Booking.findById(booking._id)
      .populate('movieId', 'title posterUrl backdropUrl duration rating language')
      .populate('cinemaId', 'name location city')
      .populate('showId', 'showDate showTime screenName ticketPrice vipPrice');

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully!',
      booking: populatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings for the authenticated user
// @route   GET /api/bookings/my
// @access  Private (protect)
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('movieId', 'title posterUrl backdropUrl duration rating language genre')
      .populate('cinemaId', 'name location city')
      .populate('showId', 'showDate showTime startTime screenName status')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking by ID (ownership protected)
// @route   GET /api/bookings/:id
// @access  Private (protect)
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('movieId')
      .populate('cinemaId')
      .populate('showId');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
      });
    }

    // Ownership check: user can only view their own booking unless admin
    if (
      booking.userId.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this booking.',
      });
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel an eligible booking
// @route   PATCH /api/bookings/:id/cancel
// @access  Private (protect)
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('showId');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
      });
    }

    // Ownership check
    if (
      booking.userId.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to cancel this booking.',
      });
    }

    // Check if already cancelled
    if (booking.status === 'CANCELLED') {
      return res.status(400).json({
        success: false,
        message: 'This booking has already been cancelled.',
      });
    }

    // Prevent cancellation of past shows
    const now = new Date();
    if (booking.showId && new Date(booking.showId.startTime) <= now) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a booking for a show that has already started or concluded.',
      });
    }

    // Update booking status
    booking.status = 'CANCELLED';
    booking.cancelledAt = new Date();
    booking.cancellationReason = req.body.reason || 'Cancelled by user';
    await booking.save();

    // Release seats safely in Show document
    await Show.findByIdAndUpdate(booking.showId._id, {
      $pull: { bookedSeats: { $in: booking.selectedSeats } },
    });

    // Remove seat reservations so they become available again
    await SeatReservation.deleteMany({
      bookingId: booking._id,
    });

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully and seats have been released.',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
};
