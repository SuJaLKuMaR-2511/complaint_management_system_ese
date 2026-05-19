const express = require('express');
const router = express.Router();
const { analyzeComplaint } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/ai/analyze - Analyze complaint with AI
router.post('/analyze', protect, analyzeComplaint);

module.exports = router;
