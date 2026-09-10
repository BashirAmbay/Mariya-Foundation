import express from 'express';
import { db } from '../db/database.js';
import { authenticateAdmin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// 1. Get Gallery Items
router.get('/', (req, res) => {
  const { category } = req.query;
  let query = 'SELECT * FROM gallery WHERE 1=1';
  const params = [];

  if (category && category !== 'All') {
    query += ' AND category = ?';
    params.push(category);
  }

  query += ' ORDER BY created_at DESC';
  const items = db.prepare(query).all(...params);
  res.json({ success: true, data: items });
});

// 2. Admin: Add Gallery Image
router.post('/', authenticateAdmin, upload.single('image'), (req, res) => {
  try {
    const { title, category, caption, location, event_date, image_url: bodyImageUrl } = req.body;

    let finalImageUrl = bodyImageUrl || '';
    if (req.file) {
      finalImageUrl = `/uploads/${req.file.filename}`;
    }

    if (!finalImageUrl) {
      return res.status(400).json({ success: false, message: 'An image file or valid image URL is required.' });
    }

    if (!title || !category) {
      return res.status(400).json({ success: false, message: 'Title and category are required.' });
    }

    const stmt = db.prepare(`
      INSERT INTO gallery (title, category, caption, image_url, location, event_date)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(title, category, caption || '', finalImageUrl, location || '', event_date || new Date().toISOString().split('T')[0]);
    const created = db.prepare('SELECT * FROM gallery WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({ success: true, message: 'Image added to gallery.', data: created });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to add image: ' + err.message });
  }
});

// 3. Admin: Delete Gallery Item
router.delete('/:id', authenticateAdmin, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const result = db.prepare('DELETE FROM gallery WHERE id = ?').run(id);

  if (result.changes === 0) {
    return res.status(404).json({ success: false, message: 'Gallery item not found.' });
  }

  res.json({ success: true, message: 'Image removed from gallery.' });
});

export default router;
