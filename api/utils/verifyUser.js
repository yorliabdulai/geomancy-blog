import jwt from 'jsonwebtoken';
import { errorHandler } from '../utils/error.js';

export const verifyToken = async (req, res, next) => {
  try {
    console.log('Request headers:', req.headers);
    console.log('Request cookies:', req.cookies);
    
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null;
    
    console.log('Extracted token:', token);

    if (!token) {
      console.log('No token found');
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded);
      req.user = decoded;
      next();
    } catch (err) {
      console.error('Token verification failed:', err);
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error during authentication' 
    });
  }
};
