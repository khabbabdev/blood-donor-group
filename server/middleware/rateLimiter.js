const rateLimit = require('express-rate-limit');

const isProduction = process.env.NODE_ENV === 'production';

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isProduction ? 200 : 100, // Higher limit in production (Vercel handles scaling)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again after 15 minutes'
  },
  // Use a consistent key generator for containerized deployments
  keyGenerator: (req) => {
    return req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  },
  // Skip rate limiting for health check
  skip: (req, res) => {
    return req.path === '/api/health';
  },
});

module.exports = rateLimiter;
