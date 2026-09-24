import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { db } from '../db/database.js';
import { authenticateAdmin } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'mariya_foundation_secure_jwt_token_secret_key_2026';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const passwordUpdateSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters')
});

// Admin Login
router.post('/login', validateBody(loginSchema), (req, res) => {
  const { email, password } = req.validatedBody;

  const admin = db.prepare('SELECT * FROM admins WHERE email = ?').get(email.toLowerCase().trim());
  if (!admin) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  const isMatch = bcrypt.compareSync(password, admin.password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  const token = jwt.sign(
    { id: admin.id, email: admin.email, role: admin.role, name: admin.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return res.json({
    success: true,
    message: 'Login successful.',
    token,
    admin: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role
    }
  });
});

// Get Current Authenticated Admin
router.get('/me', authenticateAdmin, (req, res) => {
  res.json({
    success: true,
    admin: req.admin
  });
});

// Update Password
router.put('/change-password', authenticateAdmin, validateBody(passwordUpdateSchema), (req, res) => {
  const { currentPassword, newPassword } = req.validatedBody;
  const adminId = req.admin.id;

  const admin = db.prepare('SELECT * FROM admins WHERE id = ?').get(adminId);
  const isMatch = bcrypt.compareSync(currentPassword, admin.password);
  if (!isMatch) {
    return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
  }

  const hashedNew = bcrypt.hashSync(newPassword, 10);
  db.prepare('UPDATE admins SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(hashedNew, adminId);

  res.json({ success: true, message: 'Password successfully updated.' });
});

export default router;
