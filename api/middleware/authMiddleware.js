import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  // Log all possible token locations
  console.log({
    cookies: req.cookies,
    authHeader: req.headers.authorization,
    token: req.headers.authorization?.split(' ')[1]
  });

  // Get token from Authorization header
  const bearerToken = req.headers.authorization;
  const token = bearerToken?.startsWith('Bearer ') 
    ? bearerToken.substring(7) 
    : null;

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({
      success: false,
      message: 'No authentication token provided'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      error: error.message
    });
  }
};
