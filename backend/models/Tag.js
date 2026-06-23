const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  tagName: {
    type: String,
    required: [true, 'Tag name is required'],
    unique: true,
    trim: true,
    lowercase: true
  }
}, {
  timestamps: true
});

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;