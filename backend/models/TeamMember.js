const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  joinedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Prevent duplicate members in same team
teamMemberSchema.index({ team: 1, student: 1 }, { unique: true });

const TeamMember = mongoose.model('TeamMember', teamMemberSchema);

module.exports = TeamMember;