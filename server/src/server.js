import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDatabase, db } from './db/database.js';
import { seedData } from './db/seed.js';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import programRoutes from './routes/programRoutes.js';
import impactRoutes from './routes/impactRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import newsRoutes from './routes/newsRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import volunteerRoutes from './routes/volunteerRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import donationRoutes from './routes/donationRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import statsRoutes from './routes/statsRoutes.js';

process.on('uncaughtException', (err) => {
  console.error('[UNCAUGHT EXCEPTION]:', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('[UNHANDLED REJECTION]:', reason);
});

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize SQLite database
initDatabase();
seedData();

export const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Allow frontend dev & prod access
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads folder
const uploadsPath = path.resolve(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/impact', impactRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/stats', statsRoutes);

// Root & Health Check
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'Mariya Foundation Backend API is running successfully.',
    endpoints: {
      health: '/api/health',
      programs: '/api/programs',
      news: '/api/news',
      impact: '/api/impact'
    }
  });
});

app.get('/api', (req, res) => {
  res.json({
    status: 'healthy',
    organization: 'Mariya Foundation API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    organization: 'Mariya Foundation',
    timestamp: new Date().toISOString()
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'An unexpected server error occurred.'
  });
});

// Start listening only when not executed as a Vercel serverless function
if (!process.env.VERCEL) {
  const server = app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`  Mariya Foundation Backend Server is running!      `);
    console.log(`  API Base: http://localhost:${PORT}/api            `);
    console.log(`  Uploads:  http://localhost:${PORT}/uploads        `);
    console.log(`====================================================`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n[ERROR] Port ${PORT} is already in use by another process.`);
      console.error(`Please stop the existing process using port ${PORT} before restarting.\n`);
    } else {
      console.error('\n[Server Listen Error]:', err);
    }
    process.exit(1);
  });

  const cleanup = () => {
    try {
      if (db && db.open) {
        db.close();
      }
    } catch (e) {}
  };

  process.on('SIGINT', () => { cleanup(); process.exit(0); });
  process.on('SIGTERM', () => { cleanup(); process.exit(0); });
}

export default app;
