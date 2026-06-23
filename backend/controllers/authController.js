const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Student = require('../models/Student');
const { AppError } = require('../middleware/errorMiddleware');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register student
// @route   POST /api/auth/register
// @access  Public
const registerStudent = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { 
      name, 
      email, 
      password, 
      registerNumber, 
      department, 
      year, 
      section 
    } = req.body;

    // Check if student already exists
    const existingStudent = await Student.findOne({ 
      $or: [{ email }, { registerNumber }] 
    });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Student already exists with this email or register number'
      });
    }

    // Create student
    const student = await Student.create({
      name,
      email,
      password,
      contactEmail: req.body.contactEmail || email,
      phoneNumber: req.body.phoneNumber || '',
      registerNumber,
      department,
      year,
      section: section || '',
      bio: req.body.bio || '',
      githubLink: req.body.githubLink || '',
      linkedinLink: req.body.linkedinLink || '',
      portfolioLink: req.body.portfolioLink || ''
    });

    // Generate token
    const token = generateToken(student._id);

    res.status(201).json({
      success: true,
      data: {
        _id: student._id,
        name: student.name,
        email: student.email,
        registerNumber: student.registerNumber,
        department: student.department,
        year: student.year,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login student
// @route   POST /api/auth/login
// @access  Public
const loginStudent = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find student and include password
    const student = await Student.findOne({ email }).select('+password');

    if (!student) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordMatch = await student.matchPassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(student._id);

    res.json({
      success: true,
      data: {
        _id: student._id,
        name: student.name,
        email: student.email,
        registerNumber: student.registerNumber,
        department: student.department,
        year: student.year,
        profilePicture: student.profilePicture,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current student profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    const student = await Student.findById(req.user._id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.json({
      success: true,
      data: student
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update student profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, contactEmail, phoneNumber, bio, githubLink, linkedinLink, portfolioLink } = req.body;

    const student = await Student.findById(req.user._id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Update fields
    if (name) student.name = name;
    if (contactEmail) student.contactEmail = contactEmail;
    if (phoneNumber) student.phoneNumber = phoneNumber;
    if (bio !== undefined) student.bio = bio;
    if (githubLink !== undefined) student.githubLink = githubLink;
    if (linkedinLink !== undefined) student.linkedinLink = linkedinLink;
    if (portfolioLink !== undefined) student.portfolioLink = portfolioLink;

    const updatedStudent = await student.save();

    res.json({
      success: true,
      data: updatedStudent
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerStudent,
  loginStudent,
  getProfile,
  updateProfile
};