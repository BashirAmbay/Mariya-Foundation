import express from 'express';
import { db } from '../db/database.js';
import { authenticateAdmin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// 1. Get Impact Stats
router.get('/stats', (req, res) => {
  const stats = db.prepare('SELECT * FROM impact_stats WHERE is_active = 1 ORDER BY display_order ASC').all();
  res.json({ success: true, data: stats });
});

// 2. Admin: Get all Impact Stats (including inactive)
router.get('/stats/all', authenticateAdmin, (req, res) => {
  const stats = db.prepare('SELECT * FROM impact_stats ORDER BY display_order ASC').all();
  res.json({ success: true, data: stats });
});

// 3. Admin: Update or create Impact Stat
router.put('/stats/:id', authenticateAdmin, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { label, value, prefix, suffix, description, is_active } = req.body;

  db.prepare(`
    UPDATE impact_stats SET
      label = COALESCE(?, label),
      value = COALESCE(?, value),
      prefix = COALESCE(?, prefix),
      suffix = COALESCE(?, suffix),
      description = COALESCE(?, description),
      is_active = COALESCE(?, is_active)
    WHERE id = ?
  `).run(label, value, prefix, suffix, description, is_active !== undefined ? (is_active ? 1 : 0) : null, id);

  const updated = db.prepare('SELECT * FROM impact_stats WHERE id = ?').get(id);
  res.json({ success: true, message: 'Impact stat updated.', data: updated });
});

// 4. Get Impact Stories
router.get('/stories', (req, res) => {
  const { category, featured } = req.query;
  let query = 'SELECT * FROM impact_stories WHERE 1=1';
  const params = [];

  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }
  if (featured === 'true' || featured === '1') {
    query += ' AND is_featured = 1';
  }

  query += ' ORDER BY is_featured DESC, created_at DESC';
  const stories = db.prepare(query).all(...params);
  res.json({ success: true, data: stories });
});

// 5. Admin: Create Story
router.post('/stories', authenticateAdmin, upload.single('image'), (req, res) => {
  try {
    const { title, beneficiary_name, category, before_situation, after_situation, quote, story_content, location, is_featured, image_url: bodyImageUrl } = req.body;

    if (!title || !beneficiary_name || !story_content) {
      return res.status(400).json({ success: false, message: 'Title, beneficiary name, and story content are required.' });
    }

    let finalImageUrl = bodyImageUrl || '';
    if (req.file) {
      finalImageUrl = req.file.dataUri || (req.file.filename ? `/uploads/${req.file.filename}` : '');
    }

    const stmt = db.prepare(`
      INSERT INTO impact_stories (
        title, beneficiary_name, category, before_situation, after_situation,
        quote, story_content, image_url, location, is_featured
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      title,
      beneficiary_name,
      category || 'General',
      before_situation || '',
      after_situation || '',
      quote || '',
      story_content,
      finalImageUrl,
      location || '',
      is_featured === 'true' || is_featured === 1 || is_featured === '1' ? 1 : 0
    );

    const created = db.prepare('SELECT * FROM impact_stories WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ success: true, message: 'Impact story added successfully.', data: created });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create story: ' + err.message });
  }
});

// 6. Admin: Update Story
router.put('/stories/:id', authenticateAdmin, upload.single('image'), (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = db.prepare('SELECT * FROM impact_stories WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Story not found.' });
    }

    const { title, beneficiary_name, category, before_situation, after_situation, quote, story_content, location, is_featured, image_url: bodyImageUrl } = req.body;

    let finalImageUrl = existing.image_url;
    if (req.file) {
      finalImageUrl = req.file.dataUri || (req.file.filename ? `/uploads/${req.file.filename}` : '');
    } else if (bodyImageUrl !== undefined) {
      finalImageUrl = bodyImageUrl;
    }

    db.prepare(`
      UPDATE impact_stories SET
        title = COALESCE(?, title),
        beneficiary_name = COALESCE(?, beneficiary_name),
        category = COALESCE(?, category),
        before_situation = COALESCE(?, before_situation),
        after_situation = COALESCE(?, after_situation),
        quote = COALESCE(?, quote),
        story_content = COALESCE(?, story_content),
        image_url = ?,
        location = COALESCE(?, location),
        is_featured = COALESCE(?, is_featured)
      WHERE id = ?
    `).run(
      title || null,
      beneficiary_name || null,
      category || null,
      before_situation !== undefined ? before_situation : null,
      after_situation !== undefined ? after_situation : null,
      quote !== undefined ? quote : null,
      story_content || null,
      finalImageUrl,
      location !== undefined ? location : null,
      is_featured !== undefined ? (is_featured === 'true' || is_featured === 1 || is_featured === '1' ? 1 : 0) : null,
      id
    );

    const updated = db.prepare('SELECT * FROM impact_stories WHERE id = ?').get(id);
    res.json({ success: true, message: 'Impact story updated.', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update story: ' + err.message });
  }
});

// 7. Admin: Delete Story
router.delete('/stories/:id', authenticateAdmin, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const result = db.prepare('DELETE FROM impact_stories WHERE id = ?').run(id);
  if (result.changes === 0) {
    return res.status(404).json({ success: false, message: 'Story not found.' });
  }
  res.json({ success: true, message: 'Story deleted successfully.' });
});

export default router;
