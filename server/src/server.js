require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config/db');
const Movie = require('./models/Movie');

const PORT = process.env.PORT || 5000;

let server;

const startServer = async () => {
  try {
    await connectDB();

    // Auto-check if seeding is needed for empty database in dev
    if (process.env.NODE_ENV !== 'production') {
      const movieCount = await Movie.countDocuments();
      if (movieCount === 0) {
        console.log('[IMovies] Empty database detected. Running automatic initial seed...');
        try {
          const { seedDatabase } = require('../scripts/seed');
          await seedDatabase();
        } catch (seedErr) {
          console.warn('[IMovies] Auto-seeding skipped or failed:', seedErr.message);
        }
      }
    }

    server = app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(`🎬 IMovies Server running in [${process.env.NODE_ENV || 'development'}] mode`);
      console.log(`🚀 API Base URL: http://localhost:${PORT}/api`);
      console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
      console.log(`===============================================`);
    });
  } catch (error) {
    console.error('Fatal error starting server:', error.message);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

// Handle graceful termination
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  if (server) {
    server.close(() => {
      console.log('Process terminated.');
    });
  }
});

startServer();
