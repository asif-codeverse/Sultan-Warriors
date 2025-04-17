const jwt = require('jsonwebtoken');

// Authentication middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
  const token = req.cookies.token; // Get token from cookies

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized, please log in.' });
  }

  try {
    // Decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Attach user information to the request
    next();  // Continue to the next middleware or route handler
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

module.exports = isAuthenticated;
