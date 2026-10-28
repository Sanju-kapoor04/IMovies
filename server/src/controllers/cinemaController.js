const Cinema = require('../models/Cinema');

// @desc    Get all cinemas
// @route   GET /api/cinemas
// @access  Public
const getCinemas = async (req, res, next) => {
  try {
    const { city } = req.query;
    const query = {};
    if (city) {
      query.city = { $regex: new RegExp(`^${city}$`, 'i') };
    }

    const cinemas = await Cinema.find(query).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: cinemas.length,
      cinemas,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single cinema by ID
// @route   GET /api/cinemas/:id
// @access  Public
const getCinemaById = async (req, res, next) => {
  try {
    const cinema = await Cinema.findById(req.params.id);
    if (!cinema) {
      return res.status(404).json({
        success: false,
        message: 'Cinema not found.',
      });
    }

    res.status(200).json({
      success: true,
      cinema,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCinemas,
  getCinemaById,
};
