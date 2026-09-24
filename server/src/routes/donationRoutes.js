import express from 'express';
import { z } from 'zod';
import { db } from '../db/database.js';
import { authenticateAdmin } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { submissionLimiter } from '../middleware/security.js';
import { sendEmailNotification } from '../services/emailService.js';

const router = express.Router();

const pledgeSchema = z.object({
  donorName: z.string().min(2, 'Please enter your name or Organization'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional().default(''),
  purposeCategory: z.string().min(2, 'Please select a donation purpose'),
  amount: z.union([z.number(), z.string().regex(/^\d+(\.\d{1,2})?$/)]).optional(),
  currency: z.string().default('NGN'),
  paymentMethod: z.string().default('Bank Transfer'),
  referenceNo: z.string().optional().default(''),
  notes: z.string().optional().default('')
});

// 1. Public: Get Active Donation Bank Accounts
router.get('/accounts', (req, res) => {
  const accounts = db.prepare('SELECT * FROM donation_accounts WHERE is_active = 1 ORDER BY is_primary DESC, id ASC').all();
  res.json({ success: true, data: accounts });
});

// 2. Admin: Get All Donation Accounts
router.get('/accounts/all', authenticateAdmin, (req, res) => {
  const accounts = db.prepare('SELECT * FROM donation_accounts ORDER BY is_primary DESC, id ASC').all();
  res.json({ success: true, data: accounts });
});

// 3. Admin: Create Donation Account
router.post('/accounts', authenticateAdmin, (req, res) => {
  const { bank_name, account_name, account_number, routing_or_iban, currency, instructions, is_primary, is_active } = req.body;

  if (!bank_name || !account_name || !account_number) {
    return res.status(400).json({ success: false, message: 'Bank name, account name, and account number are required.' });
  }

  // If setting primary, unset others
  if (is_primary) {
    db.prepare('UPDATE donation_accounts SET is_primary = 0').run();
  }

  const stmt = db.prepare(`
    INSERT INTO donation_accounts (bank_name, account_name, account_number, routing_or_iban, currency, instructions, is_primary, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    bank_name,
    account_name,
    account_number,
    routing_or_iban || '',
    currency || 'NGN',
    instructions || '',
    is_primary ? 1 : 0,
    is_active !== undefined ? (is_active ? 1 : 0) : 1
  );

  const created = db.prepare('SELECT * FROM donation_accounts WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ success: true, message: 'Donation account added.', data: created });
});

// 4. Admin: Update Donation Account
router.put('/accounts/:id', authenticateAdmin, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { bank_name, account_name, account_number, routing_or_iban, currency, instructions, is_primary, is_active } = req.body;

  if (is_primary) {
    db.prepare('UPDATE donation_accounts SET is_primary = 0 WHERE id != ?').run(id);
  }

  db.prepare(`
    UPDATE donation_accounts SET
      bank_name = COALESCE(?, bank_name),
      account_name = COALESCE(?, account_name),
      account_number = COALESCE(?, account_number),
      routing_or_iban = COALESCE(?, routing_or_iban),
      currency = COALESCE(?, currency),
      instructions = COALESCE(?, instructions),
      is_primary = COALESCE(?, is_primary),
      is_active = COALESCE(?, is_active)
    WHERE id = ?
  `).run(
    bank_name || null,
    account_name || null,
    account_number || null,
    routing_or_iban !== undefined ? routing_or_iban : null,
    currency || null,
    instructions !== undefined ? instructions : null,
    is_primary !== undefined ? (is_primary ? 1 : 0) : null,
    is_active !== undefined ? (is_active ? 1 : 0) : null,
    id
  );

  const updated = db.prepare('SELECT * FROM donation_accounts WHERE id = ?').get(id);
  res.json({ success: true, message: 'Donation account updated.', data: updated });
});

// 5. Admin: Delete Donation Account
router.delete('/accounts/:id', authenticateAdmin, (req, res) => {
  const id = parseInt(req.params.id, 10);
  db.prepare('DELETE FROM donation_accounts WHERE id = ?').run(id);
  res.json({ success: true, message: 'Donation account deleted.' });
});

// 6. Public: Submit Donation Pledge / Notification (Protected against spam/flooding)
router.post('/pledge', submissionLimiter, validateBody(pledgeSchema), async (req, res) => {
  try {
    const { donorName, email, phone, purposeCategory, amount, currency, paymentMethod, referenceNo, notes } = req.validatedBody;

    const parsedAmount = amount ? parseFloat(amount) : null;
    const ref = referenceNo || `MF-${Date.now().toString().slice(-6)}`;

    const stmt = db.prepare(`
      INSERT INTO donation_pledges (
        donor_name, email, phone, purpose_category, amount, currency, payment_method, reference_no, status, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pledged', ?)
    `);

    const result = stmt.run(donorName, email, phone || '', purposeCategory, parsedAmount, currency || 'NGN', paymentMethod || 'Bank Transfer', ref, notes || '');

    sendEmailNotification({
      to: 'admin@mariyafoundation.org',
      subject: `[Mariya Foundation] New Donation Notification from ${donorName} (${purposeCategory})`,
      text: `A new donation notice was submitted.\n\nDonor: ${donorName}\nEmail: ${email}\nPhone: ${phone}\nPurpose: ${purposeCategory}\nAmount: ${parsedAmount ? `${currency} ${parsedAmount.toLocaleString()}` : 'Custom / Unspecified'}\nRef: ${ref}\nNotes: ${notes}`
    }).catch(e => console.error('Error sending donation notification:', e.message));

    res.status(201).json({
      success: true,
      message: 'May Allah reward you abundantly for supporting Mariya Foundation! Your donation notification has been recorded.',
      referenceNo: ref
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to record donation: ' + err.message });
  }
});

// 7. Admin: Get Donation Pledges / Notices
router.get('/pledges', authenticateAdmin, (req, res) => {
  const { status, search } = req.query;
  let query = 'SELECT * FROM donation_pledges WHERE 1=1';
  const params = [];

  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }

  if (search) {
    query += ' AND (donor_name LIKE ? OR email LIKE ? OR reference_no LIKE ? OR purpose_category LIKE ?)';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
  }

  query += ' ORDER BY created_at DESC';
  const pledges = db.prepare(query).all(...params);

  res.json({ success: true, data: pledges });
});

// 8. Admin: Update Donation Pledge Status
router.put('/pledges/:id', authenticateAdmin, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { status, notes } = req.body;

  db.prepare(`
    UPDATE donation_pledges SET
      status = COALESCE(?, status),
      notes = COALESCE(?, notes)
    WHERE id = ?
  `).run(status || null, notes !== undefined ? notes : null, id);

  const updated = db.prepare('SELECT * FROM donation_pledges WHERE id = ?').get(id);
  res.json({ success: true, message: 'Donation pledge status updated.', data: updated });
});

export default router;
