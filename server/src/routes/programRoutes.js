import express from 'express';
import { z } from 'zod';
import { db } from '../db/database.js';
import { authenticateAdmin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Helper to format program JSON fields
function formatProgram(row) {
  if (!row) return null;
  return {
    ...row,
    objectives: typeof row.objectives === 'string' ? JSON.parse(row.objectives || '[]') : row.objectives,
    target_beneficiaries: typeof row.target_beneficiaries === 'string' ? JSON.parse(row.target_beneficiaries || '[]') : row.target_beneficiaries,
    activities: typeof row.activities === 'string' ? JSON.parse(row.activities || '[]') : row.activities,
    is_featured: Boolean(row.is_featured)
  };
}

// Helper to generate slug
function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// 1. Get Categories
router.get('/categories', (req, res) => {
  const categories = db.prepare('SELECT * FROM program_categories ORDER BY display_order ASC').all();
  res.json({ success: true, data: categories });
});

// 2. Get All Programs
router.get('/', (req, res) => {
  const { category, status, featured, search } = req.query;

  let query = `
    SELECT p.*, c.name as category_name, c.slug as category_slug
    FROM programs p
    JOIN program_categories c ON p.category_id = c.id
    WHERE 1=1
  `;
  const params = [];

  if (category) {
    query += ` AND (c.slug = ? OR c.name = ?)`;
    params.push(category, category);
  }

  if (status) {
    query += ` AND p.status = ?`;
    params.push(status);
  }

  if (featured === 'true' || featured === '1') {
    query += ` AND p.is_featured = 1`;
  }

  if (search) {
    query += ` AND (p.title LIKE ? OR p.short_description LIKE ? OR p.full_description LIKE ?)`;
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  query += ` ORDER BY p.is_featured DESC, p.created_at DESC`;

  const rows = db.prepare(query).all(...params);
  const programs = rows.map(formatProgram);

  res.json({ success: true, data: programs });
});

// 3. Get Single Program by ID or Slug
router.get('/:idOrSlug', (req, res) => {
  const { idOrSlug } = req.params;
  const isId = !isNaN(idOrSlug);

  let query = `
    SELECT p.*, c.name as category_name, c.slug as category_slug
    FROM programs p
    JOIN program_categories c ON p.category_id = c.id
    WHERE ${isId ? 'p.id = ?' : 'p.slug = ?'}
  `;

  const row = db.prepare(query).get(idOrSlug);
  if (!row) {
    return res.status(404).json({ success: false, message: 'Program not found.' });
  }

  res.json({ success: true, data: formatProgram(row) });
});

// 4. Admin: Create Program (with file upload or URL)
router.post('/', authenticateAdmin, upload.single('image'), (req, res) => {
  try {
    const {
      category_id,
      title,
      short_description,
      full_description,
      objectives,
      target_beneficiaries,
      activities,
      status,
      is_featured,
      image_url: bodyImageUrl
    } = req.body;

    if (!title || !short_description || !full_description || !category_id) {
      return res.status(400).json({ success: false, message: 'Title, category, short description and full description are required.' });
    }

    let finalImageUrl = bodyImageUrl || '';
    if (req.file) {
      finalImageUrl = `/uploads/${req.file.filename}`;
    }

    let slug = generateSlug(title);
    // Check slug collision
    const existing = db.prepare('SELECT id FROM programs WHERE slug = ?').get(slug);
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const parsedObjectives = typeof objectives === 'string' ? (objectives.startsWith('[') ? objectives : JSON.stringify(objectives.split('\n').filter(Boolean))) : JSON.stringify(objectives || []);
    const parsedBeneficiaries = typeof target_beneficiaries === 'string' ? (target_beneficiaries.startsWith('[') ? target_beneficiaries : JSON.stringify(target_beneficiaries.split('\n').filter(Boolean))) : JSON.stringify(target_beneficiaries || []);
    const parsedActivities = typeof activities === 'string' ? (activities.startsWith('[') ? activities : JSON.stringify(activities.split('\n').filter(Boolean))) : JSON.stringify(activities || []);

    const stmt = db.prepare(`
      INSERT INTO programs (
        category_id, title, slug, short_description, full_description, image_url,
        objectives, target_beneficiaries, activities, status, is_featured
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      parseInt(category_id, 10),
      title,
      slug,
      short_description,
      full_description,
      finalImageUrl,
      parsedObjectives,
      parsedBeneficiaries,
      parsedActivities,
      status || 'active',
      is_featured === 'true' || is_featured === 1 || is_featured === '1' ? 1 : 0
    );

    const created = db.prepare('SELECT * FROM programs WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ success: true, message: 'Program created successfully.', data: formatProgram(created) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create program: ' + err.message });
  }
});

// 5. Admin: Update Program
router.put('/:id', authenticateAdmin, upload.single('image'), (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = db.prepare('SELECT * FROM programs WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Program not found.' });
    }

    const {
      category_id,
      title,
      short_description,
      full_description,
      objectives,
      target_beneficiaries,
      activities,
      status,
      is_featured,
      image_url: bodyImageUrl
    } = req.body;

    let finalImageUrl = existing.image_url;
    if (req.file) {
      finalImageUrl = `/uploads/${req.file.filename}`;
    } else if (bodyImageUrl !== undefined) {
      finalImageUrl = bodyImageUrl;
    }

    const parsedObjectives = objectives !== undefined
      ? (typeof objectives === 'string' ? (objectives.startsWith('[') ? objectives : JSON.stringify(objectives.split('\n').filter(Boolean))) : JSON.stringify(objectives))
      : existing.objectives;

    const parsedBeneficiaries = target_beneficiaries !== undefined
      ? (typeof target_beneficiaries === 'string' ? (target_beneficiaries.startsWith('[') ? target_beneficiaries : JSON.stringify(target_beneficiaries.split('\n').filter(Boolean))) : JSON.stringify(target_beneficiaries))
      : existing.target_beneficiaries;

    const parsedActivities = activities !== undefined
      ? (typeof activities === 'string' ? (activities.startsWith('[') ? activities : JSON.stringify(activities.split('\n').filter(Boolean))) : JSON.stringify(activities))
      : existing.activities;

    db.prepare(`
      UPDATE programs SET
        category_id = COALESCE(?, category_id),
        title = COALESCE(?, title),
        short_description = COALESCE(?, short_description),
        full_description = COALESCE(?, full_description),
        image_url = ?,
        objectives = ?,
        target_beneficiaries = ?,
        activities = ?,
        status = COALESCE(?, status),
        is_featured = COALESCE(?, is_featured),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      category_id ? parseInt(category_id, 10) : null,
      title || null,
      short_description || null,
      full_description || null,
      finalImageUrl,
      parsedObjectives,
      parsedBeneficiaries,
      parsedActivities,
      status || null,
      is_featured !== undefined ? (is_featured === 'true' || is_featured === 1 || is_featured === '1' ? 1 : 0) : null,
      id
    );

    const updated = db.prepare('SELECT * FROM programs WHERE id = ?').get(id);
    res.json({ success: true, message: 'Program updated successfully.', data: formatProgram(updated) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update program: ' + err.message });
  }
});

// 6. Admin: Delete Program
router.delete('/:id', authenticateAdmin, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const result = db.prepare('DELETE FROM programs WHERE id = ?').run(id);

  if (result.changes === 0) {
    return res.status(404).json({ success: false, message: 'Program not found.' });
  }

  res.json({ success: true, message: 'Program deleted successfully.' });
});

export default router;
