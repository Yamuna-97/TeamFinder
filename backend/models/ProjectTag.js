const mongoose = require('mongoose');

const projectTagSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  tag: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag',
    required: true
  }
}, {
  timestamps: true
});

// Prevent duplicate tags for same project
projectTagSchema.index({ project: 1, tag: 1 }, { unique: true });

const ProjectTag = mongoose.model('ProjectTag', projectTagSchema);

module.exports = ProjectTag;