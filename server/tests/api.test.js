const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const User = require('../src/models/User');
const Movie = require('../src/models/Movie');
const Cinema = require('../src/models/Cinema');
const Show = require('../src/models/Show');
const Booking = require('../src/models/Booking');
const SeatReservation = require('../src/models/SeatReservation');

let mongoServer;
let testUser;
let testUserToken;
let otherUser;
let otherUserToken;
let testMovie;
let testCinema;
let testShow;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Create test user 1
  const pwHash = await User.hashPassword('Password123!');
  testUser = await User.create({
    name: 'Test Customer',
    email: 'testcustomer@example.com',
    passwordHash: pwHash,
  });

  // Create test user 2 (for unauthorized access tests)
  otherUser = await User.create({
    name: 'Other Customer',
    email: 'othercustomer@example.com',
    passwordHash: pwHash,
  });

  // Create test movie
  testMovie = await Movie.create({
    title: 'Inception Test Edition',
    description: 'A mind-bending psychological sci-fi thriller.',
    genre: ['Sci-Fi', 'Action'],
    language: 'English',
    duration: 148,
    rating: 8.8,
    posterUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23',
    releaseDate: new Date('2024-01-01'),
    status: 'NOW_SHOWING',
    isTrending: true,
  });

  // Create test cinema
  testCinema = await Cinema.create({
    name: 'Grand City Cinema',
    location: '100 Main St',
    city: 'Metroville',
    screens: [
      {
        name: 'Screen 1',
        totalSeats: 60,
        rows: ['A', 'B', 'C', 'D', 'E', 'F'],
        seatsPerRow: 10,
        vipRows: ['E', 'F'],
      },
    ],
  });

  // Create a future test show
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 2);
  futureDate.setHours(18, 0, 0, 0);

  testShow = await Show.create({
    movieId: testMovie._id,
    cinemaId: testCinema._id,
    screenName: 'Screen 1',
    showDate: futureDate.toISOString().split('T')[0],
    showTime: '06:00 PM',
    startTime: futureDate,
    ticketPrice: 250,
    vipPrice: 400,
    totalSeats: 60,
    bookedSeats: ['A1', 'A2'], // Existing booked seats
    status: 'ACTIVE',
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('1. Authentication Endpoints', () => {
  it('POST /api/auth/register - Successfully registers a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Jane Doe',
        email: 'janedoe@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.user).toHaveProperty('email', 'janedoe@example.com');
    expect(res.body.token).toBeDefined();
    expect(res.body.user.passwordHash).toBeUndefined();
  });

  it('POST /api/auth/register - Rejects registration with duplicate email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Jane Duplicate',
        email: 'janedoe@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/auth/register - Rejects mismatched passwords', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Mismatched',
        email: 'mismatch@example.com',
        password: 'Password123!',
        confirmPassword: 'DifferentPassword!',
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('Passwords do not match');
  });

  it('POST /api/auth/login - Authenticates valid credentials & returns token/cookie', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testcustomer@example.com',
        password: 'Password123!',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.headers['set-cookie']).toBeDefined();
    testUserToken = res.body.token;

    // Also get token for otherUser
    const otherRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'othercustomer@example.com',
        password: 'Password123!',
      });
    otherUserToken = otherRes.body.token;
  });

  it('POST /api/auth/login - Rejects incorrect credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testcustomer@example.com',
        password: 'WrongPassword!',
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/auth/me - Accessing protected route without authentication fails', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('GET /api/auth/me - Returns user profile when authenticated', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${testUserToken}`);

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe('testcustomer@example.com');
  });
});

describe('2. Movies & Shows Discovery', () => {
  it('GET /api/movies - Retrieves list of movies with status and pagination', async () => {
    const res = await request(app).get('/api/movies');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.movies)).toBe(true);
    expect(res.body.movies.length).toBeGreaterThan(0);
  });

  it('GET /api/movies/search - Searches movies by title keyword', async () => {
    const res = await request(app).get('/api/movies/search?q=Inception');
    expect(res.status).toBe(200);
    expect(res.body.movies.length).toBeGreaterThan(0);
    expect(res.body.movies[0].title).toContain('Inception');
  });

  it('GET /api/movies/:id - Returns movie details', async () => {
    const res = await request(app).get(`/api/movies/${testMovie._id}`);
    expect(res.status).toBe(200);
    expect(res.body.movie.title).toBe(testMovie.title);
  });

  it('GET /api/shows - Returns active upcoming shows', async () => {
    const res = await request(app).get(`/api/shows?movieId=${testMovie._id}`);
    expect(res.status).toBe(200);
    expect(res.body.shows.length).toBeGreaterThan(0);
  });

  it('GET /api/shows/:id/seats - Returns seat layout and booked seats', async () => {
    const res = await request(app).get(`/api/shows/${testShow._id}/seats`);
    expect(res.status).toBe(200);
    expect(res.body.bookedSeats).toContain('A1');
    expect(res.body.bookedSeats).toContain('A2');
    expect(res.body.layout.rows).toBeDefined();
  });
});

describe('3. Booking Logic, Concurrency & Seat Conflicts', () => {
  let createdBookingId;

  it('POST /api/bookings - Successfully books available seats and returns confirmation', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${testUserToken}`)
      .send({
        showId: testShow._id,
        selectedSeats: ['B1', 'B2'],
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.booking).toBeDefined();
    expect(res.body.booking.bookingReference).toMatch(/^IMOV-/);
    expect(res.body.booking.selectedSeats).toEqual(['B1', 'B2']);
    expect(res.body.booking.status).toBe('CONFIRMED');

    createdBookingId = res.body.booking._id;

    // Check that seats are now booked in the show
    const updatedShow = await Show.findById(testShow._id);
    expect(updatedShow.bookedSeats).toContain('B1');
    expect(updatedShow.bookedSeats).toContain('B2');
  });

  it('POST /api/bookings - Rejects already-booked seats', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${testUserToken}`)
      .send({
        showId: testShow._id,
        selectedSeats: ['B1', 'C1'], // B1 is already booked!
      });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('already booked');
  });

  it('POST /api/bookings - Concurrent reservation test: only ONE transaction succeeds on identical seats', async () => {
    // Two simultaneous requests attempting to book seat 'C5'
    const targetSeats = ['C5'];

    const [res1, res2] = await Promise.all([
      request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${testUserToken}`)
        .send({ showId: testShow._id, selectedSeats: targetSeats }),
      request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${otherUserToken}`)
        .send({ showId: testShow._id, selectedSeats: targetSeats }),
    ]);

    const statuses = [res1.status, res2.status].sort();
    // One must succeed (201) and the other must be rejected with conflict (409)
    expect(statuses).toEqual([201, 409]);

    // Verify seat C5 is recorded once in SeatReservation
    const reservations = await SeatReservation.find({
      showId: testShow._id,
      seatNumber: 'C5',
    });
    expect(reservations.length).toBe(1);
  });

  it('GET /api/bookings/my - Returns bookings for authenticated user', async () => {
    const res = await request(app)
      .get('/api/bookings/my')
      .set('Authorization', `Bearer ${testUserToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.bookings)).toBe(true);
    expect(res.body.bookings.some((b) => b._id.toString() === createdBookingId.toString())).toBe(true);
  });

  it('GET /api/bookings/:id - Prevents unauthorized access to another user booking', async () => {
    const res = await request(app)
      .get(`/api/bookings/${createdBookingId}`)
      .set('Authorization', `Bearer ${otherUserToken}`); // otherUser accessing testUser's booking

    expect(res.status).toBe(403);
    expect(res.body.message).toContain('not authorized');
  });

  it('PATCH /api/bookings/:id/cancel - Cancels an eligible booking and releases seats safely', async () => {
    const res = await request(app)
      .patch(`/api/bookings/${createdBookingId}/cancel`)
      .set('Authorization', `Bearer ${testUserToken}`)
      .send({ reason: 'Schedule conflict' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.booking.status).toBe('CANCELLED');

    // Verify seats 'B1' and 'B2' are released in the show
    const showAfterCancel = await Show.findById(testShow._id);
    expect(showAfterCancel.bookedSeats).not.toContain('B1');
    expect(showAfterCancel.bookedSeats).not.toContain('B2');

    // Verify they can be re-booked now!
    const rebookRes = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${testUserToken}`)
      .send({
        showId: testShow._id,
        selectedSeats: ['B1'],
      });

    expect(rebookRes.status).toBe(201);
  });
});
