const jwt = require('jsonwebtoken');

// Middleware xác thực JWT
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.sendStatus(404); // Unauthorized
    }
    jwt.verify(token, 'Q$r2K6W8n!jCW%Zk', (err, user) => {
      if (err) {
        return res.status(403).json({message: 'Invalid or expired token'});
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({message: 'Authorization token required'});
  }
};

module.exports = authenticateJWT;
