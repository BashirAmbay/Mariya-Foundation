import rateLimit from 'express-rate-limit';
import xss from 'xss';

// 1. General API Rate Limiter (500 requests per 15 min)
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again in a few minutes.'
  }
});

// 2. Strict Auth / Login Limiter (5 attempts per 15 min to prevent Brute-Force)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: {
    success: false,
    message: 'Too many failed login attempts from this IP. For security reasons, please try again in 15 minutes.'
  }
});

// 3. Public Form Submission Limiter (15 submissions per 15 min to prevent spamming/bot abuse)
export const submissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many submissions received. Please wait a few minutes before submitting another form.'
  }
});

// 4. Recursive Input Sanitization to Neutralize XSS Payloads
function sanitizeValue(value) {
  if (typeof value === 'string') {
    // Neutralize dangerous HTML/Script tags while preserving clean characters
    return xss(value.trim());
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if (value !== null && typeof value === 'object') {
    const sanitizedObj = {};
    for (const [k, v] of Object.entries(value)) {
      sanitizedObj[k] = sanitizeValue(v);
    }
    return sanitizedObj;
  }
  return value;
}

export function sanitizeInputs(req, res, next) {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeValue(req.body);
  }
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeValue(req.query);
  }
  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeValue(req.params);
  }
  next();
}
