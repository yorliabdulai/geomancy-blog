import jwt from 'jsonwebtoken';
import { errorHandler } from '../utils/error.js';

export const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.access_token || req.headers.authorization?.split('Bearer ')[1];
    
    if (!token) {
      console.log('No token found');
      return next(errorHandler(401, 'Access token required'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return next(errorHandler(401, 'Invalid or expired token'));
  }
};
