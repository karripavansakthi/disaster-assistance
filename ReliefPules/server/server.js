const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');
const { generalLimiter } = require('./middleware/rateLimiter');

// Route imports
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const emergencyRoutes = require('./routes/emergencyRoutes');
const shelterRoutes = require('./routes/shelterRoutes');
const alertRoutes = require('./routes/alertRoutes');
const medicalRoutes = require('./routes/medicalRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const rescueTeamRoutes = require('./routes/rescueTeamRoutes');
const incidentRoutes = require('./routes/incidentRoutes');
const reunificationRoutes = require('./routes/reunificationRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const statusRoutes = require('./routes/statusRoutes');

// Load environment variables
dotenv.config();

// Connect to MongoDB Atlas
connectDB();

const app = express();

const defaultOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:5175',
  'http://127.0.0.1:3000',
];

const configuredOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = [...new Set([...defaultOrigins, ...configuredOrigins])];

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;
  if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return true;
  return false;
};

// Security and utility middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Apply general rate limiting
app.use('/api', generalLimiter);

// API Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    platform: 'ReliefPulse - AI-Powered Disaster Management & Emergency Response Platform',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    aiModel: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
    tagline: 'One Platform. One Response. Every Life Matters.',
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/shelters', shelterRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/medical', medicalRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/rescue-teams', rescueTeamRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/reunification', reunificationRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/status', statusRoutes);

// 404 and error handlers
app.use(notFound);
app.use(errorHandler);

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Make io accessible in controllers via req.app.get('io')
app.set('io', io);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`[Socket.IO] Client connected: ${socket.id}`);

  socket.on('join:district', (district) => {
    socket.join(`district:${district}`);
    console.log(`[Socket.IO] ${socket.id} joined district: ${district}`);
  });

  socket.on('join:commandCenter', () => {
    socket.join('commandCenter');
    console.log(`[Socket.IO] ${socket.id} joined command center`);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  ReliefPulse Command Center Backend  v2.0         `);
  console.log(`  Port: ${PORT} | Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`  AI Model: ${process.env.GROQ_MODEL || 'llama-3.1-8b-instant'}`);
  console.log(`  Socket.IO: Enabled`);
  console.log(`  Health: http://localhost:${PORT}/api/health`);
  console.log(`  Tagline: One Platform. One Response. Every Life Matters.`);
  console.log(`====================================================`);
});

process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
});

module.exports = { app, io };
