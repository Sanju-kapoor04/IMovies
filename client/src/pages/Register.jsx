import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Form validations
    if (!name.trim()) {
      setError('Please provide your full name.');
      return;
    }

    if (!email.trim()) {
      setError('Please provide your email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-type your password.');
      return;
    }

    try {
      setLoading(true);
      await register(name.trim(), email.trim(), password, confirmPassword);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 my-md-3">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-8 col-lg-5">
          <div className="card bg-dark bg-opacity-75 border border-secondary border-opacity-50 rounded-4 shadow-lg p-4 p-md-5">
            {/* Header */}
            <div className="text-center mb-4">
              <Link to="/" className="brand-logo justify-content-center mb-2">
                <i className="bi bi-film text-danger fs-3"></i>
                <span>I<span className="text-danger">Movies</span></span>
              </Link>
              <h4 className="text-white fw-bold mb-1">Create Account</h4>
              <p className="text-secondary small">
                Join IMovies to book cinema tickets and reserve seats.
              </p>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="alert alert-danger bg-danger bg-opacity-15 border border-danger text-white rounded-3 small p-3 mb-4 d-flex align-items-center gap-2">
                <i className="bi bi-exclamation-circle-fill text-danger fs-5 flex-shrink-0"></i>
                <div>{error}</div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label text-secondary small fw-semibold">
                  Full Name
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary border-opacity-25 text-secondary">
                    <i className="bi bi-person"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control cinema-input border-start-0"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label text-secondary small fw-semibold">
                  Email Address
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary border-opacity-25 text-secondary">
                    <i className="bi bi-envelope"></i>
                  </span>
                  <input
                    type="email"
                    className="form-control cinema-input border-start-0"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label text-secondary small fw-semibold">
                  Password
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary border-opacity-25 text-secondary">
                    <i className="bi bi-lock"></i>
                  </span>
                  <input
                    type="password"
                    className="form-control cinema-input border-start-0"
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label text-secondary small fw-semibold">
                  Confirm Password
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary border-opacity-25 text-secondary">
                    <i className="bi bi-shield-check"></i>
                  </span>
                  <input
                    type="password"
                    className="form-control cinema-input border-start-0"
                    placeholder="Re-type password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-cinema-primary w-100 py-2 fw-bold"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <i className="bi bi-person-plus me-1"></i> Create Account
                  </>
                )}
              </button>
            </form>

            {/* Switch to Login */}
            <div className="text-center mt-4 text-secondary small">
              Already have an account?{' '}
              <Link to="/login" className="text-danger fw-semibold text-decoration-none">
                Sign in here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
