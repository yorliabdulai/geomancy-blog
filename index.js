import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './api/routes/user.route.js';
import authRoutes from './api/routes/auth.route.js';
import postRoutes from './api/routes/post.route.js';
import commentRoutes from './api/routes/comment.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors';  // Updated import for consistency

dotenv.config(); // Load env variables

const app = express();

// Enable CORS
app.use(cors({
  origin: 'https://geomancy-blog.vercel.app', 
  credentials: true,
}));
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  next();
});

// Middleware
app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('MongoDB is connected');
  })
  .catch((err) => {
    console.log(err);
  });

// Routes
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);  // Ensure this route exists
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);

// Serve static files from client build
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '/client/dist')));

// Handle unknown routes (for the frontend to handle its own routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Error handler middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Set port and start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}!`);
});
