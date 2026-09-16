const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');
const rateLimiter = require('./middleware/rateLimiter');

// Load env vars with fallback
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config();

// Default to production mode for Vercel deployments
if (process.env.VERCEL && !process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
}

// Connect to database
connectDB();

const app = express();

// Response compression (gzip)
app.use(compression());

// Body parser
app.use(express.json());

// Security headers with relaxed crossOriginResourcePolicy for media assets
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// Enable CORS
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    // Allow in production (same-origin requests, Vercel handles cross-origin)
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV === 'production') {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// Health checks
app.get(['/', '/health', '/api/health'], (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Blood Donor Group API is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date()
  });
});


// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
app.use(rateLimiter);

// Ensure database connection in serverless environment
app.use(async (req, res, next) => {
  if (req.path === '/api/health') {
    return next();
  }
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection failed in middleware:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Database connection failed. Please ensure MONGODB_URI is properly configured.'
    });
  }
});

// Route files
const authRoutes = require('./routes/authRoutes');
const donorRoutes = require('./routes/donorRoutes');
const bloodRequestRoutes = require('./routes/bloodRequestRoutes');
const adminRoutes = require('./routes/adminRoutes');
const contactRoutes = require('./routes/contactRoutes');
const donationRoutes = require('./routes/donationRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/donors', donorRoutes);
app.use('/api/blood-requests', bloodRequestRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/upload', uploadRoutes);

// Serve static files from client build in standalone production (not on Vercel, which serves client directly via CDN)
if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
  app.use(express.static(path.join(__dirname, '..', 'client', 'dist'), {
    maxAge: '1y',
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('index.html') || filePath.endsWith('sw.js')) {
        res.setHeader('Cache-Control', 'no-cache');
      } else if (filePath.endsWith('manifest.json')) {
        res.setHeader('Cache-Control', 'public, max-age=86400');
      }
    },
  }));
}

// Catch-all for unmatched API routes (returns JSON 404, not HTML)
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, error: 'API endpoint not found' });
});

// Error handler middleware (must be after API routes)
app.use(errorHandler);

// Serve index.html for SPA routes (standalone production only; Vercel handles SPA routes via vercel.json)
if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
  app.get('*', (req, res) => {
    const indexPath = path.join(__dirname, '..', 'client', 'dist', 'index.html');
    res.sendFile(indexPath, (err) => {
      if (err) {
        console.error('Error serving index.html:', err);
        res.status(500).send('Server error');
      }
    });
  });
}

// Export for Vercel / programmatic use
module.exports = app;

// Start server only when run directly (not when required by Vercel or tests)
if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
  });
}
