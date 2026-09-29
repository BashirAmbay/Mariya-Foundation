import express from 'express';
import { db } from '../db/database.js';
import { authenticateAdmin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// 1. Get Gallery Items
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let query = 'SELECT * FROM gallery WHERE 1=1';
    const params = [];

    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }

    query += ' ORDER BY created_at DESC';
    const items = await db.prepare(query).all(...params);
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch gallery items: ' + err.message });
  }
});

// 2. Admin: Add Gallery Image
router.post('/', authenticateAdmin, upload.single('image'), async (req, res) => {
  try {
    const { title, category, caption, location, event_date, image_url: bodyImageUrl } = req.body;

    let finalImageUrl = bodyImageUrl || '';
    if (req.file) {
      finalImageUrl = req.file.dataUri || (req.file.filename ? `/uploads/${req.file.filename}` : '');
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

    const result = await stmt.run(title, category, caption || '', finalImageUrl, location || '', event_date || new Date().toISOString().split('T')[0]);
    const created = await db.prepare('SELECT * FROM gallery WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({ success: true, message: 'Image added to gallery.', data: created });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to add image: ' + err.message });
  }
});

// 3. Admin: Update Gallery Item
router.put('/:id', authenticateAdmin, upload.single('image'), async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = await db.prepare('SELECT * FROM gallery WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Gallery item not found.' });
    }

    const { title, category, caption, location, event_date, image_url: bodyImageUrl } = req.body;

    let finalImageUrl = existing.image_url;
    if (req.file) {
      finalImageUrl = req.file.dataUri || (req.file.filename ? `/uploads/${req.file.filename}` : '');
    } else if (bodyImageUrl !== undefined && bodyImageUrl.trim() !== '') {
      finalImageUrl = bodyImageUrl;
    }

    await db.prepare(`
      UPDATE gallery SET
        title = COALESCE(?, title),
        category = COALESCE(?, category),
        caption = COALESCE(?, caption),
        image_url = ?,
        location = COALESCE(?, location),
        event_date = COALESCE(?, event_date)
      WHERE id = ?
    `).run(
      title || null,
      category || null,
      caption !== undefined ? caption : existing.caption,
      finalImageUrl,
      location !== undefined ? location : existing.location,
      event_date || null,
      id
    );

    const updated = await db.prepare('SELECT * FROM gallery WHERE id = ?').get(id);
    res.json({ success: true, message: 'Gallery item updated successfully.', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update image: ' + err.message });
  }
});

// 4. Admin: Delete Gallery Item
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const result = await db.prepare('DELETE FROM gallery WHERE id = ?').run(id);

    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'Gallery item not found.' });
    }

    res.json({ success: true, message: 'Image removed from gallery.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete gallery item: ' + err.message });
  }
});

export default router;
