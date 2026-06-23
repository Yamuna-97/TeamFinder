const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  domain: {
    type: String,
    required: [true, 'Domain is required'],
    trim: true,
    enum: [
      'Web Development',
      'Mobile Development',
      'Machine Learning',
      'Data Science',
      'Artificial Intelligence',
      'Cloud Computing',
      'Cybersecurity',
      'Blockchain',
      'IoT',
      'Game Development',
      'DevOps',
      'Other'
    ]
  },
  projectType: {
    type: String,
    required: [true, 'Project type is required'],
    enum: [
      'Web Application',
      'Mobile App',
      'Desktop Application',
      'API/Backend',
      'Research',
      'Open Source',
      'Other'
    ]
  },
  projectLevel: {
    type: String,
    required: [true, 'Project level is required'],
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  teamSize: {
    type: Number,
    required: [true, 'Team size is required'],
    min: [1, 'Team size must be at least 1'],
    max: [20, 'Team size cannot exceed 20']
  },
  currentMembers: {
    type: Number,
    default: 1,
    min: 1
  },
  minimumYear: {
    type: Number,
    required: [true, 'Minimum year is required'],
    min: 1,
    max: 5
  },
  maximumYear: {
    type: Number,
    required: [true, 'Maximum year is required'],
    min: 1,
    max: 5
  },
  meetingMode: {
    type: String,
    enum: ['Online', 'Offline', 'Hybrid'],
    default: 'Online'
  },
  location: {
    type: String,
    trim: true,
    default: ''
  },
  recruitmentDeadline: {
    type: Date,
    required: [true, 'Recruitment deadline is required']
  },
  deadline: {
    type: Date,
    required: [true, 'Project deadline is required']
  },
  status: {
    type: String,
    enum: ['Recruiting', 'In Progress', 'Completed', 'On Hold'],
    default: 'Recruiting'
  },
  githubRepo: {
    type: String,
    default: ''
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  mentorName: {
    type: String,
    default: ''
  },
  mentorEmail: {
    type: String,
    default: ''
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  }
}, {
  timestamps: true
});

// Index for search functionality
projectSchema.index({ title: 'text', description: 'text', domain: 'text' });

// Validate year range
projectSchema.pre('save', function(next) {
  if (this.minimumYear > this.maximumYear) {
    next(new Error('Minimum year cannot be greater than maximum year'));
  }
  if (this.currentMembers > this.teamSize) {
    next(new Error('Current members cannot exceed team size'));
  }
  next();
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;