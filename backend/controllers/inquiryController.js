/**
 * Inquiry Controller
 * Handles contact form submissions and inquiry management
 */

const Inquiry = require('../models/Inquiry');

/**
 * Create a new inquiry (contact form submission)
 * @route POST /api/inquiries
 * @access Public
 */
const createInquiry = async (req, res) => {
  try {
    const { name, email, phone, package: packageType, travelDate, groupSize, message } = req.body;

    // Validate required fields
    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and phone are required fields'
      });
    }

    // Create new inquiry
    const inquiry = new Inquiry({
      name,
      email,
      phone,
      package: packageType || undefined,
      travelDate: travelDate || undefined,
      groupSize: groupSize ? parseInt(groupSize) : undefined,
      message: message || undefined
    });

    await inquiry.save();

    res.status(201).json({
      success: true,
      message: 'Your inquiry has been submitted successfully. We will get back to you within 24 hours.',
      data: {
        id: inquiry._id,
        submittedAt: inquiry.createdAt
      }
    });
  } catch (error) {
    console.error('Create inquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit inquiry. Please try again later.'
    });
  }
};

/**
 * Get all inquiries (admin only)
 * @route GET /api/inquiries
 * @access Private (Admin)
 */
const getAllInquiries = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (status) {
      query.status = status;
    }

    const inquiries = await Inquiry.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('respondedBy', 'firstName lastName email');

    const total = await Inquiry.countDocuments(query);

    res.status(200).json({
      success: true,
      data: inquiries,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get inquiries error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch inquiries'
    });
  }
};

/**
 * Get single inquiry by ID
 * @route GET /api/inquiries/:id
 * @access Private (Admin)
 */
const getInquiryById = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id)
      .populate('respondedBy', 'firstName lastName email');

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    res.status(200).json({
      success: true,
      data: inquiry
    });
  } catch (error) {
    console.error('Get inquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch inquiry'
    });
  }
};

/**
 * Update inquiry status
 * @route PATCH /api/inquiries/:id
 * @access Private (Admin)
 */
const updateInquiryStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;

    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    if (status) {
      inquiry.status = status;
    }

    if (notes) {
      inquiry.notes = notes;
    }

    // Mark as responded if status changes from 'new'
    if (status && status !== 'new' && inquiry.status === 'new') {
      inquiry.respondedAt = new Date();
      inquiry.respondedBy = req.user._id;
    }

    await inquiry.save();

    res.status(200).json({
      success: true,
      message: 'Inquiry updated successfully',
      data: inquiry
    });
  } catch (error) {
    console.error('Update inquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update inquiry'
    });
  }
};

/**
 * Delete inquiry
 * @route DELETE /api/inquiries/:id
 * @access Private (Admin)
 */
const deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Inquiry deleted successfully'
    });
  } catch (error) {
    console.error('Delete inquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete inquiry'
    });
  }
};

module.exports = {
  createInquiry,
  getAllInquiries,
  getInquiryById,
  updateInquiryStatus,
  deleteInquiry
};
