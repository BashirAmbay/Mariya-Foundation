import express from 'express';
import { z } from 'zod';
import { db } from '../db/database.js';
import { authenticateAdmin } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { sendEmailNotification } from '../services/emailService.js';

const router = express.Router();

const volunteerSchema = z.object({
  fullName: z.string().min(2, 'Please enter your full name'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(7, 'Please provide a reachable phone number'),
  location: z.string().min(2, 'Please enter your city/location'),
  skills: z.string().min(2, 'Please list your skills or profession'),
  availability: z.string().min(2, 'Please select your availability'),
  areaOfInterest: z.string().min(2, 'Please select your area of interest'),
  motivation: z.string().min(10, 'Please tell us why you would like to volunteer with Mariya Foundation')
});

// 1. Public: Submit Volunteer Application
router.post('/', validateBody(volunteerSchema), async (req, res) => {
  try {
    const { fullName, email, phone, location, skills, availability, areaOfInterest, motivation } = req.validatedBody;

    const stmt = db.prepare(`
      INSERT INTO volunteer_applications (
        full_name, email, phone, location, skills, availability, area_of_interest, motivation, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `);

    const result = stmt.run(fullName, email, phone, location, skills, availability, areaOfInterest, motivation);

    sendEmailNotification({
      to: 'admin@mariyafoundation.org',
      subject: `[Mariya Foundation] New Volunteer Application: ${fullName} (${areaOfInterest})`,
      text: `A new volunteer application was submitted.\n\nName: ${fullName}\nEmail: ${email}\nPhone: ${phone}\nLocation: ${location}\nArea of Interest: ${areaOfInterest}\nAvailability: ${availability}\nSkills: ${skills}\nMotivation:\n${motivation}`
    }).catch(e => console.error('Error sending volunteer alert:', e.message));

    res.status(201).json({
      success: true,
      message: 'Thank you for your willingness to serve with Mariya Foundation! Your volunteer application has been received. Our team will contact you soon.'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to submit application: ' + err.message });
  }
});

// 2. Admin: Get Volunteer Applications
router.get('/', authenticateAdmin, (req, res) => {
  const { status, area, search } = req.query;
  let query = 'SELECT * FROM volunteer_applications WHERE 1=1';
  const params = [];

  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }

  if (area) {
    query += ' AND area_of_interest = ?';
    params.push(area);
  }

  if (search) {
    query += ' AND (full_name LIKE ? OR email LIKE ? OR skills LIKE ? OR location LIKE ?)';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
  }

  query += ' ORDER BY created_at DESC';
  const applications = db.prepare(query).all(...params);

  const pendingCount = db.prepare("SELECT count(*) as count FROM volunteer_applications WHERE status = 'pending'").get().count;

  res.json({ success: true, data: applications, pendingCount });
});

// 3. Admin: Update Volunteer Status / Notes
router.put('/:id', authenticateAdmin, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { status, admin_notes } = req.body;

  const existing = db.prepare('SELECT * FROM volunteer_applications WHERE id = ?').get(id);
  if (!existing) {
    return res.status(404).json({ success: false, message: 'Application not found.' });
  }

  db.prepare(`
    UPDATE volunteer_applications SET
      status = COALESCE(?, status),
      admin_notes = COALESCE(?, admin_notes)
    WHERE id = ?
  `).run(status || null, admin_notes !== undefined ? admin_notes : null, id);

  const updated = db.prepare('SELECT * FROM volunteer_applications WHERE id = ?').get(id);
  res.json({ success: true, message: 'Application updated.', data: updated });
});

// 4. Admin: Delete Volunteer Application
router.delete('/:id', authenticateAdmin, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const result = db.prepare('DELETE FROM volunteer_applications WHERE id = ?').run(id);

  if (result.changes === 0) {
    return res.status(404).json({ success: false, message: 'Application not found.' });
  }

  res.json({ success: true, message: 'Volunteer application deleted.' });
});

export default router;
