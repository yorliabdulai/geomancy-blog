import jwt from 'jsonwebtoken';
import { errorHandler } from '../utils/error.js';

export const verifyToken = (req, res, next) => {
  try {
    // Log incoming request details
    console.log('Headers:', req.headers);
    console.log('Cookies:', req.cookies);
    
    // Check both cookie and Authorization header
    const token = req.cookies.access_token || req.headers.authorization?.split(' ')[1];
    console.log('Extracted token:', token);
    
    if (!token) {
      console.log('No token found in request');
      return res.status(401).json({ success: false, message: 'No authentication token provided' });
    }

    // Verify the token
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
