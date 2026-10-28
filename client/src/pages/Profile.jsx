import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookingService } from '../services/bookingService';

const Profile = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeBookings: 0,
    totalSpent: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const bookings = await bookingService.getMyBookings();
        const active = bookings.filter((b) => b.status === 'CONFIRMED');
        const spent = active.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

        setStats({
          totalBookings: bookings.length,
          activeBookings: active.length,
          totalSpent: spent,
        });
      } catch (err) {
        console.warn('Could not load user stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, []);

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          {/* User Profile Card */}
          <div className="card bg-dark bg-opacity-75 border border-secondary border-opacity-50 rounded-4 overflow-hidden shadow-lg p-4 p-md-5 mb-4">
            <div className="d-flex flex-column flex-sm-row align-items-center gap-4 mb-4 text-center text-sm-start">
              {/* Avatar Initial */}
              <div
                className="rounded-circle bg-gradient text-white d-flex align-items-center justify-content-center fw-bold shadow"
                style={{
                  width: '90px',
                  height: '90px',
                  fontSize: '2.5rem',
                  background: 'linear-gradient(135deg, #e50914, #8b5cf6)',
                }}
              >
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>

              <div>
                <div className="d-flex flex-wrap align-items-center gap-2 justify-content-center justify-content-sm-start">
                  <h3 className="text-white fw-bold mb-0">{user?.name}</h3>
                  <span className="badge bg-danger text-uppercase px-2 py-1 small">
                    {user?.role || 'Member'}
                  </span>
                </div>
                <div className="text-secondary small mt-1">{user?.email}</div>
                <div className="text-muted small mt-1">
                  <i className="bi bi-calendar3 me-1"></i> Member since{' '}
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recent'}
                </div>
              </div>
            </div>

            <hr className="border-secondary border-opacity-25 my-4" />

            {/* Quick Cinema Stats */}
            <h5 className="text-white fw-bold mb-3">Booking Activity</h5>
            <div className="row g-3 text-center mb-4">
              <div className="col-4">
                <div className="p-3 rounded-3 bg-black bg-opacity-40 border border-secondary border-opacity-25">
                  <div className="fs-3 fw-bold text-danger">
                    {loading ? '...' : stats.totalBookings}
                  </div>
                  <div className="text-secondary small">Total Orders</div>
                </div>
              </div>
              <div className="col-4">
                <div className="p-3 rounded-3 bg-black bg-opacity-40 border border-secondary border-opacity-25">
                  <div className="fs-3 fw-bold text-success">
                    {loading ? '...' : stats.activeBookings}
                  </div>
                  <div className="text-secondary small">Active Shows</div>
                </div>
              </div>
              <div className="col-4">
                <div className="p-3 rounded-3 bg-black bg-opacity-40 border border-secondary border-opacity-25">
                  <div className="fs-3 fw-bold text-warning">
                    ${loading ? '...' : stats.totalSpent.toFixed(2)}
                  </div>
                  <div className="text-secondary small">Total Value</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="d-flex flex-wrap gap-3">
              <Link to="/my-bookings" className="btn btn-cinema-primary">
                <i className="bi bi-ticket-perforated me-1"></i> View My Bookings
              </Link>
              <Link to="/movies" className="btn btn-cinema-secondary">
                <i className="bi bi-film me-1"></i> Book Another Movie
              </Link>
              <button onClick={logout} className="btn btn-outline-danger ms-sm-auto">
                <i className="bi bi-box-arrow-right me-1"></i> Log Out
              </button>
            </div>
          </div>

          {/* Account Security Information */}
          <div className="p-4 rounded-4 bg-dark bg-opacity-40 border border-secondary border-opacity-25">
            <h6 className="text-white fw-bold mb-2">
              <i className="bi bi-shield-lock-fill text-success me-2"></i>
              Security & Credentials
            </h6>
            <p className="text-secondary small mb-2">
              Your account session is protected with industry-standard HttpOnly cookies, bcrypt salted password encryption, and JSON Web Tokens.
            </p>
            <div className="text-muted small">
              Session ID: <span className="font-monospace text-light">{user?.id || user?._id || 'Verified'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
