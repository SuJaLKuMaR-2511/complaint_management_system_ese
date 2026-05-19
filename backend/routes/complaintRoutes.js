const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  addComplaint,
  getAllComplaints,
  getComplaintById,
  updateComplaintStatus,
  deleteComplaint,
  searchByLocation
} = require('../controllers/complaintController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Validation for adding a complaint
const complaintValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('location').notEmpty().withMessage('Location is required')
];

// Public: Add complaint
router.post('/', complaintValidation, addComplaint);

// Protected: Search by location (must be before /:id)
router.get('/search', protect, searchByLocation);

// Protected: Get all complaints (with filter)
router.get('/', protect, getAllComplaints);

// Protected: Get single complaint
router.get('/:id', protect, getComplaintById);

// Admin: Update status
router.put('/:id', protect, adminOnly, updateComplaintStatus);

// Admin: Delete complaint
router.delete('/:id', protect, adminOnly, deleteComplaint);

module.exports = router;
