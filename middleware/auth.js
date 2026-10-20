import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_practical_7_24AIML051';

/**
 * Authentication Middleware for Practical 7
 * Verifies JWT token from Authorization: Bearer <token> header
 */
export function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Access denied. Authorization token is missing or malformed (Bearer <token> required).'
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Access denied. Bearer token is empty.'
      });
    }

    // Verify token using JWT_SECRET
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({
            error: 'Unauthorized',
            message: 'Token has expired. Please login again to refresh session.',
            isExpired: true
          });
        }
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Invalid token signature or tampered token.'
        });
      }

      // Attach decoded payload to req.user
      req.user = decoded;
      next();
    });
  } catch (err) {
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to authenticate user.'
    });
  }
}

export default authMiddleware;
