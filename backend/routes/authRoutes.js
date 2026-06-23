const express = require('express');
const { body } = require('express-validator');
const {
  registerStudent,
  loginStudent,
  getProfile,
  updateProfile
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .withMessage('Name cannot be more than 100 characters'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('registerNumber')
    .trim()
    .notEmpty()
    .withMessage('Register number is required'),
  body('department')
    .trim()
    .notEmpty()
    .withMessage('Department is required'),
  body('year')
    .isInt({ min: 1, max: 5 })
    .withMessage('Year must be between 1 and 5')
];

// Routes
router.post('/register', registerValidation, registerStudent);
router.post('/login', loginStudent);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;