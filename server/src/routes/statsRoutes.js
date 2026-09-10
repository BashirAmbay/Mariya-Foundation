import express from 'express';
import { db } from '../db/database.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard-overview', authenticateAdmin, (req, res) => {
  try {
    const totalPrograms = db.prepare('SELECT count(*) as count FROM programs').get().count;
    const activePrograms = db.prepare("SELECT count(*) as count FROM programs WHERE status = 'active'").get().count;

    const totalBeneficiaries = db.prepare('SELECT SUM(value) as total FROM impact_stats WHERE is_active = 1').get().total || 0;

    const totalMessages = db.prepare('SELECT count(*) as count FROM contact_messages').get().count;
    const unreadMessages = db.prepare('SELECT count(*) as count FROM contact_messages WHERE is_read = 0').get().count;

    const totalVolunteers = db.prepare('SELECT count(*) as count FROM volunteer_applications').get().count;
    const pendingVolunteers = db.prepare("SELECT count(*) as count FROM volunteer_applications WHERE status = 'pending'").get().count;

    const totalApplications = db.prepare('SELECT count(*) as count FROM program_applications').get().count;
    const pendingApplications = db.prepare("SELECT count(*) as count FROM program_applications WHERE status = 'pending'").get().count;

    const totalGallery = db.prepare('SELECT count(*) as count FROM gallery').get().count;
    const totalNews = db.prepare('SELECT count(*) as count FROM news').get().count;
    const totalDonationPledges = db.prepare('SELECT count(*) as count FROM donation_pledges').get().count;

    const recentMessages = db.prepare('SELECT id, full_name, email, subject, created_at, is_read FROM contact_messages ORDER BY created_at DESC LIMIT 5').all();
    const recentVolunteers = db.prepare('SELECT id, full_name, email, area_of_interest, status, created_at FROM volunteer_applications ORDER BY created_at DESC LIMIT 5').all();
    const recentApplications = db.prepare(`
      SELECT pa.id, pa.applicant_name, pa.phone, pa.status, pa.created_at, p.title as program_title
      FROM program_applications pa
      LEFT JOIN programs p ON pa.program_id = p.id
      ORDER BY pa.created_at DESC LIMIT 5
    `).all();

    res.json({
      success: true,
      data: {
        metrics: {
          totalPrograms,
          activePrograms,
          totalBeneficiaries,
          totalMessages,
          unreadMessages,
          totalVolunteers,
          pendingVolunteers,
          totalApplications,
          pendingApplications,
          totalGallery,
          totalNews,
          totalDonationPledges
        },
        recentActivities: {
          messages: recentMessages,
          volunteers: recentVolunteers,
          applications: recentApplications
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to compute dashboard metrics: ' + err.message });
  }
});

export default router;
