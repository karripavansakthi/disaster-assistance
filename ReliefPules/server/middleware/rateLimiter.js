const rateLimit = require('express-rate-limit');

// Chat limiter: max 40 requests per 15 minutes per IP
const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  message: {
    success: false,
    message: 'Too many AI requests from this IP, please try again in 15 minutes or wait a moment.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth limiter: max 20 requests per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: 'Too many login/registration attempts, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API limiter: 150 requests per 15 minutes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  message: {
    success: false,
    message: 'Too many requests created from this IP, please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { chatLimiter, authLimiter, generalLimiter };
