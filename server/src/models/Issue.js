const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved', 'closed'],
    default: 'open'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  type: {
    type: String,
    enum: ['bug', 'feature', 'task', 'story'],
    default: 'task'
  },
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  project: {
    type: String,
    required: true,
    trim: true
  },
  dueDate: {
    type: Date,
    required: false
  },
  labels: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Index for better query performance
issueSchema.index({ status: 1, priority: 1 });
issueSchema.index({ project: 1, status: 1 });

module.exports = mongoose.model('Issue', issueSchema);