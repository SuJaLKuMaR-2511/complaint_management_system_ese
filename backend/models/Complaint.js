const mongoose = require('mongoose');

/**
 * Complaint Schema - stores all complaint data with AI analysis results
 */
const ComplaintSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  title: {
    type: String,
    required: [true, 'Complaint title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Complaint description is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Water Supply', 'Electricity', 'Sanitation', 'Roads', 'Public Safety', 'Garbage', 'Other'],
    default: 'Other'
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
    default: 'Pending'
  },
  // AI Analysis Fields
  aiAnalysis: {
    priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical', null], default: null },
    department: { type: String, default: null },
    summary: { type: String, default: null },
    autoResponse: { type: String, default: null }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for location-based search
ComplaintSchema.index({ location: 'text' });

module.exports = mongoose.model('Complaint', ComplaintSchema);
