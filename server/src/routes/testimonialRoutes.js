import express from 'express';
import { db } from '../db/database.js';
import { authenticateAdmin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// 1. Get Published Testimonials
router.get('/', (req, res) => {
  const testimonials = db.prepare('SELECT * FROM testimonials WHERE is_published = 1 ORDER BY created_at DESC').all();
  res.json({ success: true, data: testimonials });
});

// 2. Admin: Get All Testimonials
router.get('/all', authenticateAdmin, (req, res) => {
  const testimonials = db.prepare('SELECT * FROM testimonials ORDER BY created_at DESC').all();
  res.json({ success: true, data: testimonials });
});

// 3. Admin: Create Testimonial
router.post('/', authenticateAdmin, upload.single('avatar'), (req, res) => {
  try {
    const { name, role_title, location, content, rating, is_published, avatar_url: bodyAvatar } = req.body;

    if (!name || !content) {
      return res.status(400).json({ success: false, message: 'Name and testimonial content are required.' });
    }

    let finalAvatar = bodyAvatar || '';
    if (req.file) {
      finalAvatar = req.file.dataUri || (req.file.filename ? `/uploads/${req.file.filename}` : '');
    }

    const stmt = db.prepare(`
      INSERT INTO testimonials (name, role_title, location, content, avatar_url, rating, is_published)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      name,
      role_title || '',
      location || '',
      content,
      finalAvatar,
      rating ? parseInt(rating, 10) : 5,
      is_published === 'false' || is_published === 0 || is_published === '0' ? 0 : 1
    );

    const created = db.prepare('SELECT * FROM testimonials WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ success: true, message: 'Testimonial added.', data: created });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to add testimonial: ' + err.message });
  }
});

// 4. Admin: Update Testimonial
router.put('/:id', authenticateAdmin, upload.single('avatar'), (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = db.prepare('SELECT * FROM testimonials WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Testimonial not found.' });
    }

    const { name, role_title, location, content, rating, is_published, avatar_url: bodyAvatar } = req.body;

    let finalAvatar = existing.avatar_url;
    if (req.file) {
      finalAvatar = req.file.dataUri || (req.file.filename ? `/uploads/${req.file.filename}` : '');
    } else if (bodyAvatar !== undefined) {
      finalAvatar = bodyAvatar;
    }

    db.prepare(`
      UPDATE testimonials SET
        name = COALESCE(?, name),
        role_title = COALESCE(?, role_title),
        location = COALESCE(?, location),
        content = COALESCE(?, content),
        avatar_url = ?,
        rating = COALESCE(?, rating),
        is_published = COALESCE(?, is_published)
      WHERE id = ?
    `).run(
      name || null,
      role_title !== undefined ? role_title : null,
      location !== undefined ? location : null,
      content || null,
      finalAvatar,
      rating ? parseInt(rating, 10) : null,
      is_published !== undefined ? (is_published === 'true' || is_published === 1 || is_published === '1' ? 1 : 0) : null,
      id
    );

    const updated = db.prepare('SELECT * FROM testimonials WHERE id = ?').get(id);
    res.json({ success: true, message: 'Testimonial updated.', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update testimonial: ' + err.message });
  }
});

// 5. Admin: Delete Testimonial
router.delete('/:id', authenticateAdmin, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const result = db.prepare('DELETE FROM testimonials WHERE id = ?').run(id);

  if (result.changes === 0) {
    return res.status(404).json({ success: false, message: 'Testimonial not found.' });
  }

  res.json({ success: true, message: 'Testimonial deleted.' });
});

export default router;
