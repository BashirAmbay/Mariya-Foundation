import express from 'express';
import { z } from 'zod';
import { db } from '../db/database.js';
import { authenticateAdmin } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { sendEmailNotification } from '../services/emailService.js';

const router = express.Router();

const contactSchema = z.object({
  fullName: z.string().min(2, 'Please enter your full name'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional().default(''),
  subject: z.string().min(3, 'Please enter a subject'),
  message: z.string().min(10, 'Message must be at least 10 characters')
});

// 1. Public: Submit Contact Message
router.post('/', validateBody(contactSchema), async (req, res) => {
  try {
    const { fullName, email, phone, subject, message } = req.validatedBody;

    const stmt = db.prepare(`
      INSERT INTO contact_messages (full_name, email, phone, subject, message, is_read, status)
      VALUES (?, ?, ?, ?, ?, 0, 'pending')
    `);

    const result = stmt.run(fullName, email, phone || '', subject, message);

    // Send email notification to foundation admin (or simulated)
    sendEmailNotification({
      to: 'admin@mariyafoundation.org',
      subject: `[Mariya Foundation] New Contact Message from ${fullName}: ${subject}`,
      text: `You have received a new contact inquiry via the Mariya Foundation website.\n\nFrom: ${fullName} (${email}, Phone: ${phone || 'N/A'})\nSubject: ${subject}\n\nMessage:\n${message}\n\nPlease log in to the admin dashboard to review.`
    }).catch(e => console.error('Error in email notifier:', e.message));

    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out to Mariya Foundation! Your message has been received. Our team will get back to you promptly.'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to send message: ' + err.message });
  }
});

// 2. Admin: Get Messages
router.get('/', authenticateAdmin, (req, res) => {
  const { status, is_read, search } = req.query;
  let query = 'SELECT * FROM contact_messages WHERE 1=1';
  const params = [];

  if (is_read !== undefined && is_read !== '') {
    query += ' AND is_read = ?';
    params.push(is_read === 'true' || is_read === '1' ? 1 : 0);
  }

  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }

  if (search) {
    query += ' AND (full_name LIKE ? OR email LIKE ? OR subject LIKE ? OR message LIKE ?)';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
  }

  query += ' ORDER BY created_at DESC';
  const messages = db.prepare(query).all(...params);

  const unreadCount = db.prepare('SELECT count(*) as count FROM contact_messages WHERE is_read = 0').get().count;

  res.json({ success: true, data: messages, unreadCount });
});

// 3. Admin: Update Message Status / Notes
router.put('/:id', authenticateAdmin, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { is_read, status, admin_notes } = req.body;

  const existing = db.prepare('SELECT * FROM contact_messages WHERE id = ?').get(id);
  if (!existing) {
    return res.status(404).json({ success: false, message: 'Message not found.' });
  }

  db.prepare(`
    UPDATE contact_messages SET
      is_read = COALESCE(?, is_read),
      status = COALESCE(?, status),
      admin_notes = COALESCE(?, admin_notes)
    WHERE id = ?
  `).run(
    is_read !== undefined ? (is_read ? 1 : 0) : null,
    status || null,
    admin_notes !== undefined ? admin_notes : null,
    id
  );

  const updated = db.prepare('SELECT * FROM contact_messages WHERE id = ?').get(id);
  res.json({ success: true, message: 'Message updated.', data: updated });
});

// 4. Admin: Delete Message
router.delete('/:id', authenticateAdmin, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const result = db.prepare('DELETE FROM contact_messages WHERE id = ?').run(id);

  if (result.changes === 0) {
    return res.status(404).json({ success: false, message: 'Message not found.' });
  }

  res.json({ success: true, message: 'Message deleted.' });
});

export default router;
