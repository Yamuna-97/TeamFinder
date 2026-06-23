const mongoose = require('mongoose');

const studentSkillSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  skillName: {
    type: String,
    required: [true, 'Skill name is required'],
    trim: true
  },
  skillLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate skills for same student
studentSkillSchema.index({ student: 1, skillName: 1 }, { unique: true });

const StudentSkill = mongoose.model('StudentSkill', studentSkillSchema);

module.exports = StudentSkill;