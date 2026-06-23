const mongoose = require('mongoose');

const joinRequestSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  message: {
    type: String,
    maxlength: [500, 'Message cannot be more than 500 characters'],
    default: ''
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected'],
    default: 'Pending'
  }
}, {
  timestamps: true
});

// Prevent duplicate requests from same student for same project
joinRequestSchema.index({ project: 1, student: 1 }, { unique: true });

const JoinRequest = mongoose.model('JoinRequest', joinRequestSchema);

module.exports = JoinRequest;