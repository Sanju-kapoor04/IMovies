const express = require('express');
const router = express.Router();
const {
  getCinemas,
  getCinemaById,
} = require('../controllers/cinemaController');

router.get('/', getCinemas);
router.get('/:id', getCinemaById);

module.exports = router;
