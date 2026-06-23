const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
    unique: true
  },
  leader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  }
}, {
  timestamps: true
});

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;