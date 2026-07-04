const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Read Authorization header
  const authHeader = req.headers.authorization;

  // Check if header exists
  if (!authHeader) {
    return res.status(401).json({
      message: "Access denied. No token provided.",
    });
  }

  // Check Bearer format
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Invalid token format.",
    });
  }

  // Extract token
  const token = authHeader.split(" ")[1];

  try {
    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Save logged-in user info
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token.",
    });
  }
};

module.exports = authMiddleware;