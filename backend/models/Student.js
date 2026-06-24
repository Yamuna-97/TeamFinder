const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  contactEmail: {
    type: String,
    lowercase: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  registerNumber: {
    type: String,
    required: [true, 'Register number is required'],
    unique: true,
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true,
    enum: [
      'Computer Science',
      'Information Technology',
      'Electronics',
      'Electrical',
      'Mechanical',
      'Civil',
      'Chemical',
      'Biotechnology',
      'Other'
    ]
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    min: [1, 'Year must be between 1 and 5'],
    max: [5, 'Year must be between 1 and 5']
  },
  section: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot be more than 500 characters'],
    default: ''
  },
  profilePicture: {
    type: String,
    default: 'default-profile.png'
  },
  githubLink: {
    type: String,
    default: ''
  },
  linkedinLink: {
    type: String,
    default: ''
  },
  portfolioLink: {
    type: String,
    default: ''
  },
  availabilityStatus: {
    type: String,
    enum: ['Available', 'Busy', 'In a Project'],
    default: 'Available'
  },
  role: {
    type: String,
    default: ''
  },
  experience: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  completedProjects: {
    type: Number,
    default: 0,
    min: 0
  },
  collegeEmailVerified: {
    type: Boolean,
    default: false
  },
  cgpa: {
    type: Number,
    min: [0, 'CGPA cannot be less than 0'],
    max: [10, 'CGPA cannot be more than 10']
  }
}, {
  timestamps: true
});

// Hash password before saving
studentSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
studentSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Remove password when converting to JSON
studentSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;