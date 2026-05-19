const Complaint = require('../models/Complaint');
const { validationResult } = require('express-validator');

/**
 * @route   POST /api/complaints
 * @desc    Add a new complaint
 * @access  Public
 */
const addComplaint = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, title, description, category, location } = req.body;

    const complaint = await Complaint.create({
      name, email, title, description, category, location
    });

    res.status(201).json({
      success: true,
      message: 'Complaint registered successfully',
      data: complaint
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/complaints
 * @desc    Get all complaints with optional category filter
 * @access  Private
 */
const getAllComplaints = async (req, res, next) => {
  try {
    const { category, status, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (status) filter.status = status;

    const total = await Complaint.countDocuments(filter);
    const complaints = await Complaint.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: complaints
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/complaints/:id
 * @desc    Get single complaint by ID
 * @access  Private
 */
const getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }
    res.json({ success: true, data: complaint });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/complaints/:id
 * @desc    Update complaint status
 * @access  Private (Admin)
 */
const updateComplaintStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'In Progress', 'Resolved', 'Rejected'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    res.json({ success: true, message: 'Status updated successfully', data: complaint });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/complaints/:id
 * @desc    Delete a complaint
 * @access  Private (Admin)
 */
const deleteComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }
    res.json({ success: true, message: 'Complaint deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/complaints/search
 * @desc    Search complaints by location
 * @access  Private
 */
const searchByLocation = async (req, res, next) => {
  try {
    const { location } = req.query;
    if (!location) {
      return res.status(400).json({ success: false, message: 'Location query is required' });
    }

    const complaints = await Complaint.find({
      location: { $regex: location, $options: 'i' }
    }).sort({ createdAt: -1 });

    res.json({ success: true, count: complaints.length, data: complaints });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addComplaint,
  getAllComplaints,
  getComplaintById,
  updateComplaintStatus,
  deleteComplaint,
  searchByLocation
};
