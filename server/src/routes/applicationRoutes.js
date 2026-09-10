import express from 'express';
import { z } from 'zod';
import { db } from '../db/database.js';
import { authenticateAdmin } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { sendEmailNotification } from '../services/emailService.js';

const router = express.Router();

const programAppSchema = z.object({
  programId: z.union([z.number(), z.string().regex(/^\d+$/)]).optional(),
  applicantName: z.string().min(2, 'Please enter your full name'),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  phone: z.string().min(7, 'Please enter a valid phone number'),
  age: z.union([z.number(), z.string().regex(/^\d+$/)]).optional(),
  gender: z.string().optional().default('Not specified'),
  address: z.string().min(3, 'Please provide your residential address/community'),
  occupation: z.string().optional().default(''),
  statementOfNeed: z.string().min(10, 'Please describe your need or reason for applying for this program')
});

// 1. Public: Submit Program Application
router.post('/', validateBody(programAppSchema), async (req, res) => {
  try {
    const { programId, applicantName, email, phone, age, gender, address, occupation, statementOfNeed } = req.validatedBody;

    const progId = programId ? parseInt(programId, 10) : null;
    const ageVal = age ? parseInt(age, 10) : null;

    const stmt = db.prepare(`
      INSERT INTO program_applications (
        program_id, applicant_name, email, phone, age, gender, address, occupation, statement_of_need, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `);

    const result = stmt.run(progId, applicantName, email || '', phone, ageVal, gender || '', address, occupation || '', statementOfNeed);

    // Fetch program title if applicable
    let programTitle = 'General Foundation Program';
    if (progId) {
      const prog = db.prepare('SELECT title FROM programs WHERE id = ?').get(progId);
      if (prog) programTitle = prog.title;
    }

    sendEmailNotification({
      to: 'admin@mariyafoundation.org',
      subject: `[Mariya Foundation] New Program Application: ${applicantName} (${programTitle})`,
      text: `A new program application was submitted.\n\nApplicant: ${applicantName}\nProgram: ${programTitle}\nPhone: ${phone}\nAddress: ${address}\nStatement of Need:\n${statementOfNeed}`
    }).catch(e => console.error('Error sending application alert:', e.message));

    res.status(201).json({
      success: true,
      message: 'Your application for Mariya Foundation support has been submitted successfully. Our verification committee will review your application.'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to submit application: ' + err.message });
  }
});

// 2. Admin: Get Program Applications
router.get('/', authenticateAdmin, (req, res) => {
  const { programId, status, search } = req.query;
  let query = `
    SELECT pa.*, p.title as program_title, pc.name as category_name
    FROM program_applications pa
    LEFT JOIN programs p ON pa.program_id = p.id
    LEFT JOIN program_categories pc ON p.category_id = pc.id
    WHERE 1=1
  `;
  const params = [];

  if (programId) {
    query += ' AND pa.program_id = ?';
    params.push(parseInt(programId, 10));
  }

  if (status) {
    query += ' AND pa.status = ?';
    params.push(status);
  }

  if (search) {
    query += ' AND (pa.applicant_name LIKE ? OR pa.phone LIKE ? OR pa.address LIKE ? OR pa.statement_of_need LIKE ?)';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
  }

  query += ' ORDER BY pa.created_at DESC';
  const applications = db.prepare(query).all(...params);

  const pendingCount = db.prepare("SELECT count(*) as count FROM program_applications WHERE status = 'pending'").get().count;

  res.json({ success: true, data: applications, pendingCount });
});

// 3. Admin: Update Application Status / Notes
router.put('/:id', authenticateAdmin, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { status, admin_notes } = req.body;

  const existing = db.prepare('SELECT * FROM program_applications WHERE id = ?').get(id);
  if (!existing) {
    return res.status(404).json({ success: false, message: 'Application not found.' });
  }

  db.prepare(`
    UPDATE program_applications SET
      status = COALESCE(?, status),
      admin_notes = COALESCE(?, admin_notes)
    WHERE id = ?
  `).run(status || null, admin_notes !== undefined ? admin_notes : null, id);

  const updated = db.prepare('SELECT * FROM program_applications WHERE id = ?').get(id);
  res.json({ success: true, message: 'Application updated.', data: updated });
});

// 4. Admin: Delete Program Application
router.delete('/:id', authenticateAdmin, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const result = db.prepare('DELETE FROM program_applications WHERE id = ?').run(id);

  if (result.changes === 0) {
    return res.status(404).json({ success: false, message: 'Application not found.' });
  }

  res.json({ success: true, message: 'Application deleted.' });
});

export default router;
