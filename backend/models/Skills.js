const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  skillName: {
    type: String,
    required: [true, 'Skill name is required'],
    unique: true,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    enum: [
      'Programming Language',
      'Framework',
      'Database',
      'Tool',
      'Soft Skill',
      'Other'
    ]
  }
}, {
  timestamps: true
});

const Skill = mongoose.model('Skill', skillSchema);

module.exports = Skill;