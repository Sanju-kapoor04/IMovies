const express = require('express');
const router = express.Router();
const {
  getShows,
  getShowById,
  getShowSeats,
} = require('../controllers/showController');

router.get('/', getShows);
router.get('/:id', getShowById);
router.get('/:id/seats', getShowSeats);

module.exports = router;
