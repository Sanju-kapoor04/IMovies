# 🎬 IMovies – Movie Ticket Booking Made Simple

[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20%2B%20Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Bootstrap](https://img.shields.io/badge/UI-Bootstrap%205-7952B3?logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![Security](https://img.shields.io/badge/Auth-JWT%20%2B%20Bcrypt%20%2B%20HttpOnly-crimson)](https://jwt.io/)
[![Tests](https://img.shields.io/badge/Tests-Jest%20%2B%20Supertest%20(18%2F18%20Passing)-brightgreen)](https://jestjs.io/)

---

## 📌 Project Overview

**IMovies – Movie Ticket Booking Made Simple** is a production-grade, responsive, and full-stack web application designed for modern cinema multiplexes. It provides moviegoers with real-time movie exploration, cinema venue schedules, interactive theater seat selection, concurrency-safe atomic seat reservations, and downloadable digital e-tickets.

Built with clean architecture, enterprise security patterns, and robust concurrency control, IMovies is designed to serve as a standout college capstone project, developer portfolio highlight, and technical evaluation benchmark.

---

## ✨ Key Features

### 🍿 Customer Experience (Frontend)
- **Modern Cinema Aesthetics**: Dark navy/black cinema theme (`#080c15`), crimson red and royal purple accents, smooth transitions, and glassmorphic card designs.
- **Dynamic Hero Banner**: Interactive featured movie banner showcasing high-resolution backdrops, ratings, trailer links, and quick booking access.
- **Movie Catalog & Discovery**: Search by keyword (title, actor, synopsis) and filter by genre (Action, Sci-Fi, Drama), language (English, Hindi, etc.), and status (*Now Showing* vs *Upcoming*).
- **Showtime Selector**: Select date, cinema venue, and showtime slot with clear pricing tags (Standard vs VIP).
- **Interactive Cinema Seat Map**:
  - Curved illumination screen graphic (*"Screen This Way"*).
  - Rows and seat numbers clearly marked with aisle spacing.
  - Visual differentiation for **Available** (grey), **Selected** (green), **Occupied** (red), and **VIP** rows (purple).
  - Multi-seat selection (up to 10 seats per booking) with dynamic live total calculation.
  - Prevents selecting already booked seats.
- **Instant Booking Confirmation**: Generates a unique reference ID (e.g., `IMOV-xxxx-xxxx`), seat summary, barcode simulation, and print/save ticket functionality.
- **My Bookings Dashboard**: Review past and upcoming bookings, display status badges (`CONFIRMED` / `CANCELLED`), view printable e-tickets, and safely cancel eligible upcoming shows.
- **User Profile**: View user information, member since date, and aggregate booking activity stats.

### 🛡️ Backend & Architectural Highlights
- **Strict Concurrency Safety**:
  - Double-layer reservation strategy:
    1. Document-level atomic check-and-push query (`$nin` + `$addToSet`) prevents race conditions.
    2. Compound unique database index `{ showId: 1, seatNumber: 1 }` on `SeatReservation` records guarantees that two concurrent requests for the same seat can never both succeed.
- **Zero-Friction Database Connectivity**:
  - Connects to **MongoDB Atlas** or **local MongoDB** via `MONGODB_URI`.
  - Automatically spins up an **in-memory MongoDB instance** (`mongodb-memory-server`) during local development and automated testing if no local database daemon is running.
- **Enterprise Authentication & Security**:
  - Password hashing with salted `bcryptjs` (passwords are never saved in plaintext).
  - Authentication via **HttpOnly cookies** (mitigating XSS attacks) and Bearer token header fallback.
  - Rate limiting on authentication routes (preventing brute-force attacks).
  - Security headers enforced via `helmet`.
  - Request body size limits (preventing payload DOS).
  - Sensitive information (`passwordHash`) automatically omitted from responses.
- **Ownership Verification**: Users can only access and cancel their own bookings.
- **Automated Test Suite**: 18 comprehensive integration tests covering authentication, search, seat layouts, atomic bookings, cancellation, and concurrency race conditions.

---

## 🏗️ Architecture & Technology Stack

```
                        ┌────────────────────────────────────────┐
                        │      React.js (Vite) Frontend          │
                        │  Bootstrap 5 + Custom Modern Cinema CSS │
                        └──────────────────┬─────────────────────┘
                                           │ HTTP/JSON + Cookies
                                           ▼
                        ┌────────────────────────────────────────┐
                        │       Node.js / Express REST API       │
                        │    JWT Auth • Rate Limit • Helmet      │
                        └──────┬──────────────────────────┬──────┘
                               │                          │
                               ▼                          ▼
               ┌──────────────────────────────┐   ┌──────────────────────────────┐
               │    Atomic Show Document      │   │   SeatReservation Model      │
               │   Show.findOneAndUpdate()    │   │  Unique Index {showId, seat} │
               └──────────────┬───────────────┘   └──────────────┬───────────────┘
                              └───────────────┬──────────────────┘
                                              ▼
                               ┌──────────────────────────────┐
                               │   MongoDB Atlas / Mongoose   │
                               │  (or In-Memory Dev Fallback) │
                               └──────────────────────────────┘
```

### Stack Summary
- **Frontend**: React 18, Vite, React Router DOM v6, Axios, Bootstrap 5, Bootstrap Icons.
- **Backend**: Node.js, Express.js, JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, `helmet`, `express-rate-limit`, `cookie-parser`, `cors`, `dotenv`.
- **Database**: MongoDB, Mongoose ODM.
- **Testing**: Jest, Supertest, `mongodb-memory-server`.

---

## 📁 Project Folder Structure

```
IMovies/
├── client/                               # React + Vite Frontend
│   ├── public/                           # Static public assets
│   ├── src/
│   │   ├── assets/                       # Images, logos, SVG icons
│   │   ├── components/                   # Reusable UI components
│   │   │   ├── BookingCard.jsx           # Booking history card
│   │   │   ├── EmptyState.jsx            # Empty state feedback
│   │   │   ├── ErrorMessage.jsx          # Error notification banner
│   │   │   ├── FilterPanel.jsx           # Catalog filter toolbar
│   │   │   ├── Footer.jsx                # Responsive footer
│   │   │   ├── HeroBanner.jsx            # Featured hero carousel
│   │   │   ├── LoadingSpinner.jsx        # Animated spinner
│   │   │   ├── MovieCard.jsx             # Movie poster card
│   │   │   ├── MovieGrid.jsx             # Responsive movies grid
│   │   │   ├── Navbar.jsx                # Navigation bar with user menu
│   │   │   ├── ProtectedRoute.jsx        # Auth route guard
│   │   │   ├── SearchBar.jsx             # Search bar with clear button
│   │   │   ├── SeatLayout.jsx            # Interactive cinema seat map
│   │   │   └── TicketModal.jsx           # Digital printable e-ticket modal
│   │   ├── context/
│   │   │   └── AuthContext.jsx           # Authentication state context
│   │   ├── pages/
│   │   │   ├── BookingConfirmation.jsx   # Order receipt page
│   │   │   ├── Home.jsx                  # Main landing page
│   │   │   ├── Login.jsx                 # User sign in page
│   │   │   ├── MovieDetails.jsx          # Movie info & showtimes
│   │   │   ├── Movies.jsx                # Movie catalog with filters
│   │   │   ├── MyBookings.jsx            # User booking history
│   │   │   ├── NotFound.jsx              # Custom 404 page
│   │   │   ├── Profile.jsx               # User profile & stats
│   │   │   ├── Register.jsx              # Account registration
│   │   │   └── SeatSelection.jsx         # Cinema seat picking page
│   │   ├── services/
│   │   │   ├── api.js                    # Axios instance with credentials
│   │   │   ├── authService.js            # Auth API calls
│   │   │   ├── bookingService.js         # Booking API calls
│   │   │   └── movieService.js           # Movie and show API calls
│   │   ├── App.jsx                       # Routes and layout
│   │   ├── index.css                     # Cinema theme styling
│   │   └── main.jsx                      # Vite entry point
│   ├── .env.example                      # Client environment template
│   ├── index.html                        # HTML template
│   ├── package.json                      # Client dependencies
│   └── vite.config.js                    # Vite configuration & dev proxy
│
├── server/                               # Node.js + Express Backend
│   ├── scripts/
│   │   └── seed.js                       # Comprehensive database seeder
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                     # MongoDB connection & memory fallback
│   │   ├── controllers/
│   │   │   ├── authController.js         # Register, login, logout, me
│   │   │   ├── bookingController.js      # Concurrency-safe booking logic
│   │   │   ├── cinemaController.js       # Cinema locations & screens
│   │   │   ├── movieController.js        # Catalog search & filtering
│   │   │   └── showController.js         # Showtimes & real-time seats
│   │   ├── middleware/
│   │   │   ├── auth.js                   # JWT verification & ownership
│   │   │   ├── errorHandler.js           # Centralized safe error handler
│   │   │   └── rateLimiter.js            # Brute-force protection
│   │   ├── models/
│   │   │   ├── Booking.js                # Booking schema
│   │   │   ├── Cinema.js                 # Cinema venue schema
│   │   │   ├── Movie.js                  # Movie schema with indexes
│   │   │   ├── SeatReservation.js        # Unique compound index {showId, seat}
│   │   │   ├── Show.js                   # Scheduled showtime schema
│   │   │   └── User.js                   # User schema with bcrypt hashing
│   │   ├── routes/
│   │   │   ├── authRoutes.js             # /api/auth
│   │   │   ├── bookingRoutes.js          # /api/bookings
│   │   │   ├── cinemaRoutes.js           # /api/cinemas
│   │   │   ├── movieRoutes.js            # /api/movies
│   │   │   └── showRoutes.js             # /api/shows
│   │   ├── utils/
│   │   │   └── generateToken.js          # JWT & HttpOnly cookie generator
│   │   ├── app.js                        # Express application configuration
│   │   └── server.js                     # HTTP server startup & auto-seeder
│   ├── tests/
│   │   └── api.test.js                   # 18 automated integration tests
│   ├── .env.example                      # Server environment template
│   └── package.json                      # Server dependencies
│
├── .gitignore
├── package.json                          # Root convenience scripts
└── README.md
```

---

## ⚡ Prerequisites

Before running the application, make sure you have installed:
- **Node.js**: `v18.0.0` or higher (tested on Node v20 LTS)
- **npm**: `v9.0.0` or higher
- **MongoDB** *(Optional)*: MongoDB Atlas account or a local MongoDB daemon running on `mongodb://127.0.0.1:27017`.
  *(Note: If no MongoDB server is running, the application automatically launches an in-memory database so you can evaluate the project immediately without setup hassle!)*

---

## 🚀 Quick Start Guide (Run Locally)

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/imovies-booking.git
cd IMovies
```

### Step 2: Install Dependencies
Run the installation command from the project root:
```bash
# Install root, backend, and frontend dependencies
npm run install:all
```
*Alternatively, install individually:*
```bash
npm install
cd server && npm install
cd ../client && npm install
cd ..
```

### Step 3: Configure Environment Variables
Copy the provided `.env.example` templates into `.env` files:

#### Backend (`server/.env`)
```bash
cp server/.env.example server/.env
```
Ensure `server/.env` contains:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/imovies
JWT_SECRET=imovies_dev_secret_key_928374829104829182374981
JWT_EXPIRES_IN=7d
COOKIE_NAME=imovies_token
CLIENT_URL=http://localhost:5173
```

#### Frontend (`client/.env`)
```bash
cp client/.env.example client/.env
```
Ensure `client/.env` contains:
```env
VITE_API_BASE_URL=/api
```

### Step 4: Seed the Database
Populate sample movies, cinemas, screens, showtimes, and demo user accounts:
```bash
npm run seed
```
*Output will display:*
```text
✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!
👤 Demo User:   demo@imovies.com  / Password123!
👑 Admin User:  admin@imovies.com / Password123!
🎬 Movies:      8 movies loaded
🏢 Cinemas:     3 venues
🎟️  Shows:       72 available showtimes
```

### Step 5: Launch the Application
Start both the backend server and frontend client concurrently:
```bash
npm run dev
```

- **Frontend Application**: [http://localhost:5173](http://localhost:5173)
- **Backend API Server**: [http://localhost:5000/api](http://localhost:5000/api)
- **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

*(You can also run them in separate terminals with `npm run server` and `npm run client`.)*

---

## 🧪 Automated Testing

The backend includes a comprehensive automated test suite testing all endpoints, race conditions, and ownership rules using **Jest** and **Supertest**:

```bash
npm test
```

### Test Coverage Highlights:
- ✅ **Authentication**: Valid registration, password mismatch rejection, duplicate email prevention, password hashing, and invalid credential handling.
- ✅ **Route Guards**: Protected route rejection for unauthenticated users, JWT extraction from cookies and headers.
- ✅ **Catalog**: Movie listing, full-text search, movie details retrieval, active shows query, and seat layout matrix retrieval.
- ✅ **Seat Booking**: Successful booking of available seats, atomic status update.
- ✅ **Conflict Prevention**: Immediate 409 rejection when selecting already booked seats.
- ✅ **Race Condition / Concurrency Test**: Two simultaneous concurrent booking transactions attempting to reserve the exact same seat (`C5`) at the exact same millisecond. Exactly one transaction succeeds (201) and the competing transaction is safely rejected (409).
- ✅ **Cancellation & Seat Release**: Cancelling an eligible booking safely restores seats to the available inventory and permits subsequent re-booking.
- ✅ **Access Control**: Users are strictly blocked (403 Forbidden) from accessing other users' booking records.

---

## 🔑 Demo Accounts for Evaluators

For fast evaluation, use these pre-seeded development accounts:

| Role | Email | Password | Pre-seeded Activity |
| :--- | :--- | :--- | :--- |
| **Demo User** | `demo@imovies.com` | `Password123!` | Has an active sample booking with confirmed seats in My Bookings |
| **Admin User** | `admin@imovies.com` | `Password123!` | System administrator privileges |

*(The login page also provides convenient one-click "Demo User" and "Admin User" auto-fill buttons.)*

---

## 📚 REST API Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register new user account | No |
| `POST` | `/api/auth/login` | Verify credentials & issue JWT | No |
| `POST` | `/api/auth/logout` | Clear auth cookie | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes (JWT) |

### 🎬 Movies (`/api/movies`)
| Method | Endpoint | Description | Query Parameters |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/movies` | Get movie catalog with pagination | `status`, `genre`, `language`, `search`, `page`, `limit` |
| `GET` | `/api/movies/search` | Search movie catalog | `q=<search_term>` |
| `GET` | `/api/movies/meta/filters` | Get distinct genres & languages | None |
| `GET` | `/api/movies/:id` | Get single movie details by ID | None |

### 🏢 Cinemas (`/api/cinemas`)
| Method | Endpoint | Description | Query Parameters |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/cinemas` | List all cinema venues | `city` |
| `GET` | `/api/cinemas/:id` | Get cinema details & screens | None |

### 🎟️ Shows (`/api/shows`)
| Method | Endpoint | Description | Query Parameters |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/shows` | List available showtimes | `movieId`, `cinemaId`, `date`, `includePast` |
| `GET` | `/api/shows/:id` | Get show details with movie & venue | None |
| `GET` | `/api/shows/:id/seats`| Get interactive seat layout & live booked seats | None |

### 📋 Bookings (`/api/bookings`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/bookings` | Create concurrency-safe booking | Yes |
| `GET` | `/api/bookings/my` | View authenticated user's bookings | Yes |
| `GET` | `/api/bookings/:id` | View booking details (ownership checked)| Yes |
| `PATCH`| `/api/bookings/:id/cancel` | Cancel eligible booking & release seats | Yes |

---

## 🌐 Production Deployment

The project is structured to deploy smoothly to modern cloud platforms:

### Option A: Unified Full-Stack Deployment (Render / Railway / Heroku)
The Express server is configured to automatically serve the compiled React build (`client/dist`) when it exists:

1. In the build settings, set the build command:
   ```bash
   npm run install:all && npm run build --prefix client
   ```
2. Set the start command:
   ```bash
   npm start
   ```
3. Set environment variables:
   - `NODE_ENV`: `production`
   - `PORT`: `5000` (or injected by host)
   - `MONGODB_URI`: Your MongoDB Atlas connection URI (`mongodb+srv://...`)
   - `JWT_SECRET`: A long random secret string (e.g., 64 characters)

### Option B: Separate Frontend (Vercel / Netlify) + Backend (Render / Railway)
1. Deploy `server/` to Render/Railway:
   - Set `CLIENT_URL` to your Vercel URL (e.g. `https://imovies.vercel.app`).
2. Deploy `client/` to Vercel:
   - Set root directory to `client`.
   - Set environment variable `VITE_API_BASE_URL` to your backend URL (e.g. `https://imovies-api.onrender.com/api`).

---

## ❓ Common Issues & Troubleshooting

1. **Port 5000 or 5173 already in use**:
   - Change `PORT=5001` in `server/.env` and update Vite's proxy target in `client/vite.config.js`.
2. **MongoDB Connection Refused**:
   - The application automatically falls back to an embedded in-memory MongoDB in development mode.
   - For persistent storage, verify that local MongoDB is running (`mongod`) or provide a free MongoDB Atlas cluster connection string in `server/.env`.
3. **CORS issues during API calls**:
   - Verify `CLIENT_URL` in `server/.env` matches your frontend origin (default: `http://localhost:5173`).
   - The frontend Vite proxy forwards `/api` directly to `http://localhost:5000` during development, bypassing browser CORS issues entirely.

---

## 📄 License & Attribution

Developed with ❤️ as a full-stack movie booking system demonstration. Free to use for educational, evaluation, and portfolio purposes.
