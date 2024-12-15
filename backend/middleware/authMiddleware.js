const jwt = require("jsonwebtoken")

const authMiddleware = (req, res, next) => {
    console.log("test mid")
    const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.user = { userId: decoded.userId }; 
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware