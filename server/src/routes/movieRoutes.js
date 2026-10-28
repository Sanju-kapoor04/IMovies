const express = require('express');
const router = express.Router();
const {
  getMovies,
  searchMovies,
  getMovieById,
  getMovieFilters,
} = require('../controllers/movieController');

router.get('/search', searchMovies);
router.get('/meta/filters', getMovieFilters);
router.get('/', getMovies);
router.get('/:id', getMovieById);

module.exports = router;
