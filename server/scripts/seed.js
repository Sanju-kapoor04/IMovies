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
    title: 'Kalki 2898 AD',
    description:
      'Set in a post-apocalyptic world in the year 2898 AD, a modern avatar of Vishnu descends to Earth to protect the world from evil forces led by Supreme Yaskin, aided by the immortal warrior Ashwatthama.',
    genre: ['Sci-Fi', 'Action', 'Mythology'],
    language: 'Hindi',
    duration: 181,
    rating: 8.5,
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1600&q=80',
    cast: ['Prabhas', 'Amitabh Bachchan', 'Kamal Haasan', 'Deepika Padukone', 'Disha Patani'],
    director: 'Nag Ashwin',
    trailerUrl: 'https://www.youtube.com/watch?v=kQDd1AhGIHk',
    releaseDate: new Date('2024-06-27'),
    status: 'NOW_SHOWING',
    isTrending: true,
  },
  {
    title: 'Stree 2: Sarkate Ka Aatank',
    description:
      'The town of Chanderi is once again haunted by a headless entity named "Sarkata" who abducts progressive women. Vicky and his friends, along with the mysterious female spirit, unite to defeat the terrifying evil force.',
    genre: ['Comedy', 'Horror'],
    language: 'Hindi',
    duration: 147,
    rating: 8.3,
    posterUrl: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1600&q=80',
    cast: ['Rajkummar Rao', 'Shraddha Kapoor', 'Pankaj Tripathi', 'Abhishek Banerjee', 'Aparshakti Khurana'],
    director: 'Amar Kaushik',
    trailerUrl: 'https://www.youtube.com/watch?v=KVnhefk_83w',
    releaseDate: new Date('2024-08-15'),
    status: 'NOW_SHOWING',
    isTrending: true,
  },
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
    title: 'Jawan',
    description:
      'A prison warden recruits inmates to commit outrageous crimes that shed light on corruption and injustice, leading to a showdown with a ruthless arms dealer who wronged him years ago.',
    genre: ['Action', 'Thriller'],
    language: 'Hindi',
    duration: 169,
    rating: 8.2,
    posterUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    cast: ['Shah Rukh Khan', 'Nayanthara', 'Vijay Sethupathi', 'Deepika Padukone', 'Priyamani'],
    director: 'Atlee',
    trailerUrl: 'https://www.youtube.com/watch?v=COv52Qyctws',
    releaseDate: new Date('2023-09-07'),
    status: 'NOW_SHOWING',
    isTrending: false,
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
    isTrending: false,
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
    title: 'War 2',
    description:
      'Major Kabir Dhaliwal returns for an adrenaline-fueled international espionage showdown as RAW faces an unprecedented global threat in the YRF Spy Universe.',
    genre: ['Action', 'Thriller'],
    language: 'Hindi',
    duration: 155,
    rating: 8.6,
    posterUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1600&q=80',
    cast: ['Hrithik Roshan', 'N. T. Rama Rao Jr.', 'Kiara Advani'],
    director: 'Ayan Mukerji',
    trailerUrl: 'https://www.youtube.com/watch?v=tQ0mzXRk-oM',
    releaseDate: new Date('2025-08-14'),
    status: 'UPCOMING',
    isTrending: true,
  },
];

const cinemasData = [
  {
    name: 'PVR INOX Superplex - Phoenix Palladium',
    location: '462 Senapati Bapat Marg, Lower Parel',
    city: 'Mumbai',
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
    name: 'Cinepolis VIP Luxe - Forum South Mall',
    location: 'Kanakapura Road, Konanakunte',
    city: 'Bengaluru',
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
    name: "PVR Director's Cut & Gold - Ambience Mall",
    location: 'NH-8, Ambience Island, DLF Phase 3',
    city: 'Delhi NCR',
    facilities: ['4K RGB Laser', 'Dolby 7.1 Surround', 'Café & Bistro', 'Wheelchair Accessible'],
    screens: [
      {
        name: 'Screen 1 Gold Class',
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

            const isIMAX = screen.name.toLowerCase().includes('imax');
            const isVIPLuxe =
              screen.name.toLowerCase().includes('vip') ||
              screen.name.toLowerCase().includes('gold');

            // Realistic Indian Multiplex Pricing Structure:
            // Morning shows (< 12 PM): Budget friendly rates (₹160-₹290)
            // Afternoon shows (12 PM-5 PM): Moderate rates (₹200-₹350)
            // Prime Evening/Night (>= 5 PM): Prime rates (₹250-₹420)
            let standardTicketPrice = 220;
            let vipTicketPrice = 380;

            if (timeSlot.hour < 12) {
              standardTicketPrice = isIMAX ? 260 : isVIPLuxe ? 290 : 160;
              vipTicketPrice = isIMAX ? 420 : isVIPLuxe ? 480 : 280;
            } else if (timeSlot.hour < 17) {
              standardTicketPrice = isIMAX ? 320 : isVIPLuxe ? 350 : 200;
              vipTicketPrice = isIMAX ? 500 : isVIPLuxe ? 560 : 340;
            } else {
              standardTicketPrice = isIMAX ? 380 : isVIPLuxe ? 420 : 250;
              vipTicketPrice = isIMAX ? 600 : isVIPLuxe ? 680 : 420;
            }

            showsToInsert.push({
              movieId: movie._id,
              cinemaId: cinema._id,
              screenName: screen.name,
              showDate: dateString,
              showTime: timeSlot.timeStr,
              startTime: startTimestamp,
              ticketPrice: standardTicketPrice,
              vipPrice: vipTicketPrice,
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
