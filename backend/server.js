const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

// Import models and routes
const User = require('./models/User');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  }
});

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files for PDF uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mindease')
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes(io));
app.use('/api/user', userRoutes(io));
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

const PORT = process.env.PORT || 5000;

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  let currentUserId = null;

  // Join user to their personal room
  socket.on('join', async (userId) => {
    socket.join(userId);
    currentUserId = userId;
    console.log(`User ${userId} joined room`);

    // Update user online status
    try {
      await User.findByIdAndUpdate(userId, { isOnline: true });
      // Emit to admin
      io.to('admin').emit('userOnline', { userId });
    } catch (error) {
      console.error('Error updating online status:', error);
    }
  });

  // Handle chat messages
  socket.on('sendMessage', (data) => {
    // Broadcast to all connected clients or specific rooms
    io.emit('message', data);
  });

  // Handle user actions for real-time stats
  socket.on('userAction', (data) => {
    // Broadcast stats updates to admin clients
    io.to('admin').emit('statsUpdate', data);
  });

  // Join admin room
  socket.on('joinAdmin', () => {
    socket.join('admin');
  });

  socket.on('disconnect', async () => {
    console.log('User disconnected:', socket.id);
    if (currentUserId) {
      try {
        await User.findByIdAndUpdate(currentUserId, { isOnline: false });
        // Emit to admin
        io.to('admin').emit('userOffline', { userId: currentUserId });
      } catch (error) {
        console.error('Error updating offline status:', error);
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = { app, server, io };
