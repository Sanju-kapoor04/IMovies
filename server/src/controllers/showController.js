const Show = require('../models/Show');
const Cinema = require('../models/Cinema');
const Movie = require('../models/Movie');

// @desc    Get shows with optional filters (movie, cinema, date)
// @route   GET /api/shows
// @access  Public
const getShows = async (req, res, next) => {
  try {
    const { movieId, cinemaId, date, includePast } = req.query;
    const query = { status: 'ACTIVE' };

    if (movieId) {
      query.movieId = movieId;
    }
    if (cinemaId) {
      query.cinemaId = cinemaId;
    }
    if (date) {
      query.showDate = date;
    }

    // By default, prevent returning shows that have already begun
    if (includePast !== 'true') {
      const now = new Date();
      query.startTime = { $gte: now };
    }

    const shows = await Show.find(query)
      .populate('movieId', 'title posterUrl backdropUrl duration rating language genre')
      .populate('cinemaId', 'name location city screens')
      .sort({ startTime: 1 });

    res.status(200).json({
      success: true,
      count: shows.length,
      shows,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single show by ID
// @route   GET /api/shows/:id
// @access  Public
const getShowById = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate('movieId')
      .populate('cinemaId');

    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found.',
      });
    }

    res.status(200).json({
      success: true,
      show,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get seat map and booked status for a show
// @route   GET /api/shows/:id/seats
// @access  Public
const getShowSeats = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate('movieId', 'title duration rating language posterUrl')
      .populate('cinemaId', 'name location screens');

    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found.',
      });
    }

    // Find the screen layout from cinema if available
    let rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    let seatsPerRow = 10;
    let vipRows = ['G', 'H'];

    if (show.cinemaId && show.cinemaId.screens) {
      const screen = show.cinemaId.screens.find(
        (s) => s.name === show.screenName
      );
      if (screen) {
        if (screen.rows && screen.rows.length > 0) rows = screen.rows;
        if (screen.seatsPerRow) seatsPerRow = screen.seatsPerRow;
        if (screen.vipRows && screen.vipRows.length > 0) vipRows = screen.vipRows;
      }
    }

    // Check if show is in the past
    const isPast = new Date() > new Date(show.startTime);

    res.status(200).json({
      success: true,
      showId: show._id,
      movie: show.movieId,
      cinema: {
        id: show.cinemaId._id,
        name: show.cinemaId.name,
        location: show.cinemaId.location,
      },
      screenName: show.screenName,
      showDate: show.showDate,
      showTime: show.showTime,
      startTime: show.startTime,
      isPast,
      ticketPrice: show.ticketPrice,
      vipPrice: show.vipPrice,
      layout: {
        rows,
        seatsPerRow,
        vipRows,
        totalSeats: show.totalSeats || rows.length * seatsPerRow,
      },
      bookedSeats: show.bookedSeats || [],
      availableSeatsCount:
        (show.totalSeats || rows.length * seatsPerRow) -
        (show.bookedSeats ? show.bookedSeats.length : 0),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getShows,
  getShowById,
  getShowSeats,
};
