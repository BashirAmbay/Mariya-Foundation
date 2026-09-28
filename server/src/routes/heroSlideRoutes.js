import express from 'express';
import { db } from '../db/database.js';
import { authenticateAdmin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// 1. Get Slides (Public: active only, Admin: ?all=true includes inactive)
router.get('/', (req, res) => {
  try {
    const { all } = req.query;
    let query = 'SELECT * FROM hero_slides';
    if (!all || all !== 'true') {
      query += ' WHERE is_active = 1';
    }
    query += ' ORDER BY display_order ASC, id ASC';

    const slides = db.prepare(query).all();
    res.json({ success: true, data: slides });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch hero slides: ' + err.message });
  }
});

// 2. Admin: Add new Hero Background Slide
router.post('/', authenticateAdmin, upload.single('image'), (req, res) => {
  try {
    const { title, display_order, image_url: bodyImageUrl } = req.body;

    let finalImageUrl = bodyImageUrl || '';
    if (req.file) {
      finalImageUrl = req.file.dataUri || (req.file.filename ? `/uploads/${req.file.filename}` : '');
    }

    if (!finalImageUrl) {
      return res.status(400).json({ success: false, message: 'An image file or valid image URL is required.' });
    }

    const order = display_order ? parseInt(display_order, 10) : 0;

    const stmt = db.prepare(`
      INSERT INTO hero_slides (title, image_url, display_order, is_active)
      VALUES (?, ?, ?, 1)
    `);

    const result = stmt.run(title || 'Mariya Foundation Hero Slide', finalImageUrl, order);
    const created = db.prepare('SELECT * FROM hero_slides WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({ success: true, message: 'Hero background slide added.', data: created });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to add hero slide: ' + err.message });
  }
});

// 3. Admin: Update / Replace Slide Image and Details
router.put('/:id', authenticateAdmin, upload.single('image'), (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = db.prepare('SELECT * FROM hero_slides WHERE id = ?').get(id);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Hero slide not found.' });
    }

    const { title, display_order, image_url: bodyImageUrl, is_active } = req.body;

    let finalImageUrl = existing.image_url;
    if (req.file) {
      finalImageUrl = req.file.dataUri || (req.file.filename ? `/uploads/${req.file.filename}` : existing.image_url);
    } else if (bodyImageUrl) {
      finalImageUrl = bodyImageUrl;
    }

    const newTitle = title !== undefined && title.trim() !== '' ? title.trim() : existing.title;
    const newOrder = display_order !== undefined && display_order !== '' ? parseInt(display_order, 10) : existing.display_order;
    const newActive = is_active !== undefined ? (is_active === '1' || is_active === 1 || is_active === true ? 1 : 0) : existing.is_active;

    db.prepare(`
      UPDATE hero_slides 
      SET title = ?, image_url = ?, display_order = ?, is_active = ?
      WHERE id = ?
    `).run(newTitle, finalImageUrl, newOrder, newActive, id);

    const updated = db.prepare('SELECT * FROM hero_slides WHERE id = ?').get(id);

    res.json({ success: true, message: 'Hero background image replaced successfully.', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update hero slide: ' + err.message });
  }
});

// 4. Admin: Toggle Active State
router.patch('/:id/toggle', authenticateAdmin, (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const slide = db.prepare('SELECT * FROM hero_slides WHERE id = ?').get(id);

    if (!slide) {
      return res.status(404).json({ success: false, message: 'Hero slide not found.' });
    }

    const newStatus = slide.is_active === 1 ? 0 : 1;
    db.prepare('UPDATE hero_slides SET is_active = ? WHERE id = ?').run(newStatus, id);

    res.json({ success: true, message: `Slide set to ${newStatus === 1 ? 'active' : 'inactive'}.`, is_active: newStatus });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update slide: ' + err.message });
  }
});

// 5. Admin: Reset to Default Sample Slides
router.post('/reset-defaults', authenticateAdmin, (req, res) => {
  try {
    db.prepare('DELETE FROM hero_slides').run();
    const insertSlide = db.prepare(`
      INSERT INTO hero_slides (title, image_url, display_order, is_active)
      VALUES (?, ?, ?, 1)
    `);
    insertSlide.run('Students Learning & Educational Support (Sample 1)', 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=2000&q=80', 1);
    insertSlide.run('Students in Classroom Study Circle (Sample 2)', 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=2000&q=80', 2);
    insertSlide.run('Youth Empowerment & School Supplies (Sample 3)', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=2000&q=80', 3);
    insertSlide.run('Children Learning & Community Care (Sample 4)', 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=2000&q=80', 4);

    const slides = db.prepare('SELECT * FROM hero_slides ORDER BY display_order ASC, id ASC').all();
    res.json({ success: true, message: 'Default sample background slides restored.', data: slides });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to reset slides: ' + err.message });
  }
});

// 6. Admin: Clear All Slides
router.delete('/clear-all', authenticateAdmin, (req, res) => {
  try {
    db.prepare('DELETE FROM hero_slides').run();
    res.json({ success: true, message: 'All hero background slides removed.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to clear slides: ' + err.message });
  }
});

// 7. Admin: Delete Single Slide
router.delete('/:id', authenticateAdmin, (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const result = db.prepare('DELETE FROM hero_slides WHERE id = ?').run(id);

    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'Hero slide not found.' });
    }

    res.json({ success: true, message: 'Hero background slide removed.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete hero slide: ' + err.message });
  }
});

export default router;
