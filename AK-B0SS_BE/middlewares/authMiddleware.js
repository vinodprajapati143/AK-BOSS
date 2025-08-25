// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  console.log('token: ', token);

  if (!token)
    return res.status(401).json({ message: 'Access denied. Token missing.' });
  // Agar token "Bearer <token>" form me hai to sirf token part nikalo
  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length); // "Bearer " ke baad ka part
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // req.user me data aa jayega
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
