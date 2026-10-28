require('dotenv').config();
const mongoose = require('mongoose');
const { connectDB } = require('../src/config/db');
const User = require('../src/models/User');
const Movie = require('../src/models/Movie');
const Cinema = require('../src/models/Cinema');
const Show = require('../src/models/Show');
const Booking = require('../src/models/Booking');
const SeatReservation = require('../src/models/SeatReservation');

const moviesData = [
  {
    title: 'Dune: Part Two',
    description:
      'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, he endeavors to prevent a terrible future only he can foresee.',
    genre: ['Sci-Fi', 'Adventure', 'Action'],
    language: 'English',
    duration: 166,
    rating: 8.8,
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Javier Bardem', 'Austin Butler'],
    director: 'Denis Villeneuve',
    trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w',
    releaseDate: new Date('2024-03-01'),
    status: 'NOW_SHOWING',
    isTrending: true,
  },
  {
    title: 'Oppenheimer',
    description:
      'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II, examining the moral dilemmas and the political fallout of creating the most destructive weapon in human history.',
    genre: ['Biography', 'Drama', 'History'],
    language: 'English',
    duration: 180,
    rating: 8.9,
    posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1600&q=80',
    cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon', 'Robert Downey Jr.', 'Florence Pugh'],
    director: 'Christopher Nolan',
    trailerUrl: 'https://www.youtube.com/watch?v=uYPbbksJxIg',
    releaseDate: new Date('2023-07-21'),
    status: 'NOW_SHOWING',
    isTrending: true,
  },
  {
    title: 'Interstellar',
    description:
      'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans through a newly discovered wormhole near Saturn.',
    genre: ['Sci-Fi', 'Drama', 'Adventure'],
    language: 'English',
    duration: 169,
    rating: 8.7,
    posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1600&q=80',
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine'],
    director: 'Christopher Nolan',
    trailerUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
    releaseDate: new Date('2014-11-07'),
    status: 'NOW_SHOWING',
    isTrending: true,
  },
  {
    title: 'Spider-Man: Across the Spider-Verse',
    description:
      'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. When the heroes clash on how to handle a new threat, Miles must redefine what it means to be a hero.',
    genre: ['Animation', 'Action', 'Adventure'],
    language: 'English',
    duration: 140,
    rating: 8.7,
    posterUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1600&q=80',
    cast: ['Shameik Moore', 'Hailee Steinfeld', 'Oscar Isaac', 'Jake Johnson'],
    director: 'Joaquim Dos Santos, Kemp Powers',
    trailerUrl: 'https://www.youtube.com/watch?v=cqGjhVJWtEg',
    releaseDate: new Date('2023-06-02'),
    status: 'NOW_SHOWING',
    isTrending: false,
  },
  {
    title: 'Inception',
    description:
      'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.',
    genre: ['Action', 'Sci-Fi', 'Thriller'],
    language: 'English',
    duration: 148,
    rating: 8.8,
    posterUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page', 'Tom Hardy'],
    director: 'Christopher Nolan',
    trailerUrl: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
    releaseDate: new Date('2010-07-16'),
    status: 'NOW_SHOWING',
    isTrending: false,
  },
  {
    title: 'The Dark Knight',
    description:
      'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    genre: ['Action', 'Crime', 'Drama'],
    language: 'English',
    duration: 152,
    rating: 9.0,
    posterUrl: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1600&q=80',
    cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart', 'Michael Caine', 'Gary Oldman'],
    director: 'Christopher Nolan',
    trailerUrl: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
    releaseDate: new Date('2008-07-18'),
    status: 'NOW_SHOWING',
    isTrending: true,
  },
  {
    title: 'Gladiator II',
    description:
      'Years after witnessing the death of Maximus at the hands of his uncle, Lucius must enter the Colosseum after his home is conquered by the tyrannical Emperors who now lead Rome with an iron fist.',
    genre: ['Action', 'Adventure', 'Drama'],
    language: 'English',
    duration: 148,
    rating: 8.4,
    posterUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1600&q=80',
    cast: ['Paul Mescal', 'Pedro Pascal', 'Denzel Washington', 'Connie Nielsen'],
    director: 'Ridley Scott',
    trailerUrl: 'https://www.youtube.com/watch?v=4rgYUipGJNo',
    releaseDate: new Date('2024-11-22'),
    status: 'UPCOMING',
    isTrending: false,
  },
  {
    title: 'Avatar: Fire and Ash',
    description:
      'Jake Sully and Neytiri encounter a new, aggressive volcanic clan of Na\'vi known as the "Ash People" led by Varang, exploring new conflicts across the moons of Pandora.',
    genre: ['Action', 'Adventure', 'Fantasy'],
    language: 'English',
    duration: 185,
    rating: 8.5,
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80',
    cast: ['Sam Worthington', 'Zoe Saldaña', 'Sigourney Weaver', 'Oona Chaplin'],
    director: 'James Cameron',
    trailerUrl: 'https://www.youtube.com/watch?v=d9MyW72ELq0',
    releaseDate: new Date('2025-12-19'),
    status: 'UPCOMING',
    isTrending: false,
  },
];

const cinemasData = [
  {
    name: 'IMAX Grand Cinema - Downtown',
    location: '450 Lexington Ave, Central District',
    city: 'Metropolis',
    facilities: ['Laser IMAX 3D', 'Dolby Atmos 128-Channel', 'Ultra-Plush Recliners', 'Gourmet Bar'],
    screens: [
      {
        name: 'Audi 1 - IMAX Laser',
        totalSeats: 80,
        rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
        seatsPerRow: 10,
        vipRows: ['G', 'H'],
      },
      {
        name: 'Audi 2 - Dolby Cinema',
        totalSeats: 60,
        rows: ['A', 'B', 'C', 'D', 'E', 'F'],
        seatsPerRow: 10,
        vipRows: ['E', 'F'],
      },
    ],
  },
  {
    name: 'Cinepolis VIP Luxe - Silicon City',
    location: '12 Tech Park Boulevard, Silicon Valley',
    city: 'San Jose',
    facilities: ['Dolby Atmos', 'In-Seat Dining', 'Heated Recliners', 'Free Valet'],
    screens: [
      {
        name: 'Screen VIP 1',
        totalSeats: 60,
        rows: ['A', 'B', 'C', 'D', 'E', 'F'],
        seatsPerRow: 10,
        vipRows: ['E', 'F'],
      },
    ],
  },
  {
    name: 'PVR Superplex - Metro Mall',
    location: 'Mall of the Stars, 8th Floor',
    city: 'New York',
    facilities: ['4K RGB Laser', 'Dolby 7.1 Surround', 'Café & Bistro', 'Wheelchair Accessible'],
    screens: [
      {
        name: 'Screen 1 Gold',
        totalSeats: 80,
        rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
        seatsPerRow: 10,
        vipRows: ['G', 'H'],
      },
    ],
  },
];

const seedDatabase = async () => {
  try {
    console.log('[Seed] Cleaning old database collections...');
    await Promise.all([
      User.deleteMany({}),
      Movie.deleteMany({}),
      Cinema.deleteMany({}),
      Show.deleteMany({}),
      Booking.deleteMany({}),
      SeatReservation.deleteMany({}),
    ]);

    console.log('[Seed] Inserting users...');
    const demoPasswordHash = await User.hashPassword('Password123!');
    const demoUser = await User.create({
      name: 'Demo Cinephile',
      email: 'demo@imovies.com',
      passwordHash: demoPasswordHash,
      role: 'user',
    });

    const adminUser = await User.create({
      name: 'IMovies Admin',
      email: 'admin@imovies.com',
      passwordHash: demoPasswordHash,
      role: 'admin',
    });

    console.log('[Seed] Inserting cinemas...');
    const createdCinemas = await Cinema.insertMany(cinemasData);

    console.log('[Seed] Inserting movies...');
    const createdMovies = await Movie.insertMany(moviesData);

    console.log('[Seed] Generating upcoming showtimes for the next 7 days...');
    const nowShowingMovies = createdMovies.filter((m) => m.status === 'NOW_SHOWING');
    const showsToInsert = [];

    // Schedule shows for today and next 5 days
    const baseTimes = [
      { timeStr: '10:30 AM', hour: 10, minute: 30 },
      { timeStr: '01:45 PM', hour: 13, minute: 45 },
      { timeStr: '05:00 PM', hour: 17, minute: 0 },
      { timeStr: '08:15 PM', hour: 20, minute: 15 },
      { timeStr: '11:00 PM', hour: 23, minute: 0 },
    ];

    const today = new Date();

    for (let dayOffset = 0; dayOffset <= 5; dayOffset++) {
      const showDateObj = new Date(today);
      showDateObj.setDate(today.getDate() + dayOffset);
      const dateString = showDateObj.toISOString().split('T')[0];

      createdCinemas.forEach((cinema) => {
        cinema.screens.forEach((screen) => {
          // Assign 2 movies per screen per day
          const assignedMovies = nowShowingMovies.slice(0, 3);

          assignedMovies.forEach((movie, mIdx) => {
            const timeSlot = baseTimes[(mIdx * 2 + dayOffset) % baseTimes.length];

            const startTimestamp = new Date(showDateObj);
            startTimestamp.setHours(timeSlot.hour, timeSlot.minute, 0, 0);

            // Give a few pre-booked seats to show 1 to simulate a live active cinema
            const bookedSeats = [];
            if (dayOffset === 0 && mIdx === 0) {
              bookedSeats.push('A3', 'A4', 'C5', 'C6', 'D4', 'D5', 'G5', 'G6');
            } else if (dayOffset === 1) {
              bookedSeats.push('B3', 'B4', 'E7', 'E8');
            }

            showsToInsert.push({
              movieId: movie._id,
              cinemaId: cinema._id,
              screenName: screen.name,
              showDate: dateString,
              showTime: timeSlot.timeStr,
              startTime: startTimestamp,
              ticketPrice: 14.5,
              vipPrice: 22.0,
              totalSeats: screen.totalSeats,
              bookedSeats,
              status: 'ACTIVE',
            });
          });
        });
      });
    }

    const createdShows = await Show.insertMany(showsToInsert);
    console.log(`[Seed] Inserted ${createdShows.length} shows across ${createdCinemas.length} cinemas.`);

    // Create seat reservations for the pre-booked seats
    const firstShowWithSeats = createdShows.find((s) => s.bookedSeats.length > 0);
    if (firstShowWithSeats) {
      const bookingRef = `IMOV-${Date.now().toString(36).toUpperCase()}-INIT`;
      const sampleSeats = firstShowWithSeats.bookedSeats.slice(0, 2);

      const demoBooking = await Booking.create({
        bookingReference: bookingRef,
        userId: demoUser._id,
        showId: firstShowWithSeats._id,
        movieId: firstShowWithSeats.movieId,
        cinemaId: firstShowWithSeats.cinemaId,
        selectedSeats: sampleSeats,
        numberOfTickets: sampleSeats.length,
        ticketPrice: firstShowWithSeats.ticketPrice,
        totalAmount: firstShowWithSeats.ticketPrice * sampleSeats.length,
        status: 'CONFIRMED',
        paymentDetails: {
          method: 'DEMO_INSTANT_CONFIRMATION',
          status: 'DEMO_COMPLETED',
          note: 'Sample initial booking for demo account.',
        },
      });

      const seatDocs = sampleSeats.map((seat) => ({
        showId: firstShowWithSeats._id,
        seatNumber: seat,
        bookingId: demoBooking._id,
        userId: demoUser._id,
      }));
      await SeatReservation.insertMany(seatDocs);
      console.log(`[Seed] Created sample booking for demo user (${demoBooking.bookingReference})`);
    }

    console.log('--------------------------------------------------');
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('👤 Demo User:   demo@imovies.com  / Password123!');
    console.log('👑 Admin User:  admin@imovies.com / Password123!');
    console.log(`🎬 Movies:      ${createdMovies.length} movies loaded`);
    console.log(`🏢 Cinemas:     ${createdCinemas.length} venues`);
    console.log(`🎟️  Shows:       ${createdShows.length} available showtimes`);
    console.log('--------------------------------------------------');
  } catch (error) {
    console.error('Seeding error:', error);
    throw error;
  }
};

// If run directly via CLI
if (require.main === module) {
  connectDB()
    .then(async () => {
      await seedDatabase();
      await mongoose.disconnect();
      process.exit(0);
    })
    .catch((err) => {
      console.error('Fatal seed failure:', err);
      process.exit(1);
    });
}

module.exports = { seedDatabase };
