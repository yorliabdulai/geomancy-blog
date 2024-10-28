import jwt from 'jsonwebtoken';
import { errorHandler } from '../utils/error.js';

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token || req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return next(errorHandler(401, 'Unauthorized - No token provided'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return next(errorHandler(401, 'Unauthorized - Invalid token'));
  }
};
