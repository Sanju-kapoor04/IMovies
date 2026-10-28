const jwt = require('jsonwebtoken');

const generateTokenAndSetCookie = (res, user) => {
  const secret = process.env.JWT_SECRET || 'fallback_imovies_secret_key_change_in_prod';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role || 'user',
    },
    secret,
    { expiresIn }
  );

  const cookieName = process.env.COOKIE_NAME || 'imovies_token';
  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie(cookieName, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });

  return token;
};

const clearAuthCookie = (res) => {
  const cookieName = process.env.COOKIE_NAME || 'imovies_token';
  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie(cookieName, '', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    expires: new Date(0),
    path: '/',
  });
};

module.exports = { generateTokenAndSetCookie, clearAuthCookie };
