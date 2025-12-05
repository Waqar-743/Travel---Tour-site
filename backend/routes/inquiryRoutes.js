/**
 * Inquiry Routes
 * Routes for contact form submissions and inquiry management
 */

const express = require('express');
const router = express.Router();
const {
  createInquiry,
  getAllInquiries,
  getInquiryById,
  updateInquiryStatus,
  deleteInquiry
} = require('../controllers/inquiryController');
const { protect, adminOnly } = require('../middleware');

// Public route - anyone can submit an inquiry
router.post('/', createInquiry);

// Protected routes - admin only
router.get('/', protect, adminOnly, getAllInquiries);
router.get('/:id', protect, adminOnly, getInquiryById);
router.patch('/:id', protect, adminOnly, updateInquiryStatus);
router.delete('/:id', protect, adminOnly, deleteInquiry);

module.exports = router;
