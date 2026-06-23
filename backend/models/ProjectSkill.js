const mongoose = require('mongoose');

const projectSkillSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  skillName: {
    type: String,
    required: [true, 'Skill name is required'],
    trim: true
  },
  requiredLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate skills for same project
projectSkillSchema.index({ project: 1, skillName: 1 }, { unique: true });

const ProjectSkill = mongoose.model('ProjectSkill', projectSkillSchema);

module.exports = ProjectSkill;