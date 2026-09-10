import express from 'express';
import { db } from '../db/database.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// 1. Public: Get All Site Settings
router.get('/', (req, res) => {
  const rows = db.prepare('SELECT key, value, group_name FROM site_settings').all();
  const settings = {};
  rows.forEach(r => {
    // Hide sensitive keys from public if any
    if (!r.key.toLowerCase().includes('secret') && !r.key.toLowerCase().includes('password')) {
      settings[r.key] = r.value;
    }
  });
  res.json({ success: true, data: settings });
});

// 2. Admin: Update Site Settings
router.put('/', authenticateAdmin, (req, res) => {
  const settings = req.body;
  if (!settings || typeof settings !== 'object') {
    return res.status(400).json({ success: false, message: 'Settings payload must be a key-value object.' });
  }

  const upsert = db.prepare(`
    INSERT INTO site_settings (key, value, group_name)
    VALUES (?, ?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value
  `);

  const tx = db.transaction((entries) => {
    for (const [k, v] of entries) {
      if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
        upsert.run(k, String(v), 'general');
      }
    }
  });

  tx(Object.entries(settings));

  const updatedRows = db.prepare('SELECT key, value FROM site_settings').all();
  const updatedSettings = {};
  updatedRows.forEach(r => { updatedSettings[r.key] = r.value; });

  res.json({ success: true, message: 'Settings saved successfully.', data: updatedSettings });
});

export default router;
