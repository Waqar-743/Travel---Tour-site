/**
 * GB Travel Agency - Backend Server
 * Main entry point for the Express application
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Database
const connectDB = require('./config/database');

// Routes
const {
  authRoutes,
  userRoutes,
  destinationRoutes,
  tripRoutes,
  bookingRoutes,
  reviewRoutes,
  paymentRoutes,
  inquiryRoutes,
} = require('./routes');

// Middleware
const { errorHandler, notFound } = require('./middleware');
const { paymentController } = require('./controllers');

// Initialize Express app
const app = express();

// Trust proxy (needed for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:5174',
    'http://localhost:5173/gb-travel-agency', 
    'https://waqar-743.github.io',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
    error: {
      message: 'Rate limit exceeded',
      statusCode: 429,
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Stripe webhook - needs raw body (before json parser)
app.post('/api/payments/webhook', 
  express.raw({ type: 'application/json' }), 
  paymentController.handleWebhook
);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'GB Travel Agency API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/inquiries', inquiryRoutes);

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'GB Travel Agency API',
    version: '1.0.0',
    endpoints: {
      auth: {
        'POST /api/auth/register': 'Register new user',
        'POST /api/auth/login': 'Login user',
        'POST /api/auth/logout': 'Logout user (protected)',
        'POST /api/auth/refresh-token': 'Refresh access token',
        'GET /api/auth/me': 'Get current user (protected)',
        'PUT /api/auth/change-password': 'Change password (protected)',
      },
      users: {
        'GET /api/users/profile': 'Get user profile (protected)',
        'PUT /api/users/profile': 'Update user profile (protected)',
        'DELETE /api/users/profile': 'Delete account (protected)',
        'GET /api/users/bookings': 'Get user bookings (protected)',
        'POST /api/users/favorites/:destinationId': 'Add to favorites (protected)',
        'DELETE /api/users/favorites/:destinationId': 'Remove from favorites (protected)',
      },
      destinations: {
        'GET /api/destinations': 'Get all destinations',
        'GET /api/destinations/:id': 'Get single destination',
        'GET /api/destinations/search': 'Search destinations',
        'GET /api/destinations/featured': 'Get featured destinations',
        'GET /api/destinations/popular': 'Get popular destinations',
        'GET /api/destinations/countries': 'Get countries with destinations',
        'POST /api/destinations': 'Create destination (admin)',
        'PUT /api/destinations/:id': 'Update destination (admin)',
        'DELETE /api/destinations/:id': 'Delete destination (admin)',
      },
      trips: {
        'GET /api/trips': 'Get all trips',
        'GET /api/trips/:id': 'Get single trip',
        'GET /api/trips/search': 'Search trips',
        'GET /api/trips/featured': 'Get featured trips',
        'GET /api/trips/upcoming': 'Get upcoming trips',
        'GET /api/trips/destination/:destinationId': 'Get trips by destination',
        'GET /api/trips/:id/availability': 'Check trip availability',
        'POST /api/trips': 'Create trip (admin)',
        'PUT /api/trips/:id': 'Update trip (admin)',
        'DELETE /api/trips/:id': 'Delete trip (admin)',
      },
      bookings: {
        'POST /api/bookings': 'Create booking (protected)',
        'GET /api/bookings': 'Get user bookings (protected)',
        'GET /api/bookings/:id': 'Get booking details (protected)',
        'GET /api/bookings/confirmation/:code': 'Get booking by confirmation code',
        'PUT /api/bookings/:id/cancel': 'Cancel booking (protected)',
        'GET /api/bookings/admin/all': 'Get all bookings (admin)',
        'GET /api/bookings/admin/stats': 'Get booking statistics (admin)',
        'PUT /api/bookings/:id/status': 'Update booking status (admin)',
      },
      reviews: {
        'POST /api/reviews': 'Create review (protected)',
        'GET /api/reviews/trip/:tripId': 'Get reviews for trip',
        'GET /api/reviews/user/:userId': 'Get reviews by user',
        'GET /api/reviews/:id': 'Get single review',
        'PUT /api/reviews/:id': 'Update review (protected)',
        'DELETE /api/reviews/:id': 'Delete review (protected)',
        'POST /api/reviews/:id/helpful': 'Vote review as helpful (protected)',
        'GET /api/reviews/admin/all': 'Get all reviews (admin)',
        'PUT /api/reviews/:id/moderate': 'Moderate review (admin)',
      },
      payments: {
        'POST /api/payments/create-checkout': 'Create Stripe checkout (protected)',
        'GET /api/payments/verify/:sessionId': 'Verify payment (protected)',
        'GET /api/payments/history': 'Get payment history (protected)',
        'GET /api/payments/:id': 'Get payment details (protected)',
        'POST /api/payments/webhook': 'Stripe webhook',
        'GET /api/payments/admin/all': 'Get all payments (admin)',
        'GET /api/payments/admin/stats': 'Get payment statistics (admin)',
      },
    },
  });
});

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Start listening
    app.listen(PORT, () => {
      console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🌍 GB Travel Agency Backend Server                      ║
║                                                           ║
║   Server running on port: ${PORT}                          ║
║   Environment: ${process.env.NODE_ENV || 'development'}                           ║
║   API URL: http://localhost:${PORT}/api                    ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

// Start the server
startServer();

module.exports = app;
