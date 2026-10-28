const Movie = require('../models/Movie');

// @desc    Get all movies with filtering, search, and pagination
// @route   GET /api/movies
// @access  Public
const getMovies = async (req, res, next) => {
  try {
    const {
      status,
      genre,
      language,
      isTrending,
      search,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    if (status) {
      query.status = status;
    }
    if (genre) {
      // Support multiple genres comma-separated or single
      const genres = genre.split(',').map((g) => g.trim());
      query.genre = { $in: genres };
    }
    if (language) {
      query.language = { $regex: new RegExp(`^${language}$`, 'i') };
    }
    if (isTrending === 'true') {
      query.isTrending = true;
    }
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { cast: searchRegex },
      ];
    }

    // Sorting
    let sortBy = { rating: -1, releaseDate: -1 };
    if (sort === 'releaseDate') sortBy = { releaseDate: -1 };
    if (sort === 'title') sortBy = { title: 1 };
    if (sort === 'rating') sortBy = { rating: -1 };

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Movie.countDocuments(query);
    const movies = await Movie.find(query)
      .sort(sortBy)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: movies.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      movies,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search movies
// @route   GET /api/movies/search
// @access  Public
const searchMovies = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === '') {
      return res.status(200).json({
        success: true,
        count: 0,
        movies: [],
      });
    }

    const regex = new RegExp(q.trim(), 'i');
    const movies = await Movie.find({
      $or: [
        { title: regex },
        { genre: regex },
        { cast: regex },
        { language: regex },
      ],
    })
      .limit(10)
      .select('title posterUrl rating genre language duration status');

    res.status(200).json({
      success: true,
      count: movies.length,
      movies,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single movie by ID
// @route   GET /api/movies/:id
// @access  Public
const getMovieById = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found.',
      });
    }

    res.status(200).json({
      success: true,
      movie,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get distinct genres and languages
// @route   GET /api/movies/meta/filters
// @access  Public
const getMovieFilters = async (req, res, next) => {
  try {
    const [genres, languages] = await Promise.all([
      Movie.distinct('genre'),
      Movie.distinct('language'),
    ]);

    res.status(200).json({
      success: true,
      genres: genres.sort(),
      languages: languages.sort(),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMovies,
  searchMovies,
  getMovieById,
  getMovieFilters,
};
