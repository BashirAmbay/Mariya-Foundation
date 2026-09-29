import express from 'express';
import { db } from '../db/database.js';
import { authenticateAdmin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// 1. Get Published News
router.get('/', async (req, res) => {
  try {
    const { category, search, limit } = req.query;
    let query = 'SELECT * FROM news WHERE is_published = 1';
    const params = [];

    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (title LIKE ? OR summary LIKE ? OR content LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY published_at DESC, created_at DESC';

    if (limit) {
      query += ' LIMIT ?';
      params.push(parseInt(limit, 10));
    }

    const articles = await db.prepare(query).all(...params);
    res.json({ success: true, data: articles });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch news: ' + err.message });
  }
});

// 2. Admin: Get All News (including drafts)
router.get('/admin/all', authenticateAdmin, async (req, res) => {
  try {
    const articles = await db.prepare('SELECT * FROM news ORDER BY created_at DESC').all();
    res.json({ success: true, data: articles });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch news: ' + err.message });
  }
});

// 3. Get Single Article by ID or Slug
router.get('/:idOrSlug', async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const isId = !isNaN(idOrSlug);

    const query = isId
      ? 'SELECT * FROM news WHERE id = ?'
      : 'SELECT * FROM news WHERE slug = ?';

    const article = await db.prepare(query).get(idOrSlug);
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found.' });
    }

    res.json({ success: true, data: article });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch article: ' + err.message });
  }
});

// 4. Admin: Create News Article
router.post('/', authenticateAdmin, upload.single('image'), async (req, res) => {
  try {
    const { title, summary, content, category, author, is_published, published_at, featured_image: bodyImage } = req.body;

    if (!title || !summary || !content) {
      return res.status(400).json({ success: false, message: 'Title, summary, and content are required.' });
    }

    let finalImageUrl = bodyImage || '';
    if (req.file) {
      finalImageUrl = req.file.dataUri || (req.file.filename ? `/uploads/${req.file.filename}` : '');
    }

    let slug = generateSlug(title);
    const existing = await db.prepare('SELECT id FROM news WHERE slug = ?').get(slug);
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const stmt = db.prepare(`
      INSERT INTO news (title, slug, summary, content, category, author, featured_image, is_published, published_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const pubVal = is_published === 'true' || is_published === 1 || is_published === '1' ? 1 : 0;
    const pubDate = published_at || new Date().toISOString();

    const result = await stmt.run(
      title,
      slug,
      summary,
      content,
      category || 'Announcements',
      author || 'Mariya Foundation Team',
      finalImageUrl,
      pubVal,
      pubDate
    );

    const created = await db.prepare('SELECT * FROM news WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ success: true, message: 'Article created successfully.', data: created });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create article: ' + err.message });
  }
});

// 5. Admin: Update News Article
router.put('/:id', authenticateAdmin, upload.single('image'), async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = await db.prepare('SELECT * FROM news WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Article not found.' });
    }

    const { title, summary, content, category, author, is_published, published_at, featured_image: bodyImage } = req.body;

    let finalImageUrl = existing.featured_image;
    if (req.file) {
      finalImageUrl = req.file.dataUri || (req.file.filename ? `/uploads/${req.file.filename}` : '');
    } else if (bodyImage !== undefined) {
      finalImageUrl = bodyImage;
    }

    await db.prepare(`
      UPDATE news SET
        title = COALESCE(?, title),
        summary = COALESCE(?, summary),
        content = COALESCE(?, content),
        category = COALESCE(?, category),
        author = COALESCE(?, author),
        featured_image = ?,
        is_published = COALESCE(?, is_published),
        published_at = COALESCE(?, published_at),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      title || null,
      summary || null,
      content || null,
      category || null,
      author || null,
      finalImageUrl,
      is_published !== undefined ? (is_published === 'true' || is_published === 1 || is_published === '1' ? 1 : 0) : null,
      published_at || null,
      id
    );

    const updated = await db.prepare('SELECT * FROM news WHERE id = ?').get(id);
    res.json({ success: true, message: 'Article updated successfully.', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update article: ' + err.message });
  }
});

// 6. Admin: Delete News Article
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const result = await db.prepare('DELETE FROM news WHERE id = ?').run(id);

    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'Article not found.' });
    }

    res.json({ success: true, message: 'Article deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete article: ' + err.message });
  }
});

export default router;
