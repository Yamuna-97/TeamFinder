const express = require('express');
const {
  getStudents,
  getStudent,
  getMySkills,
  addSkill,
  updateSkill,
  deleteSkill
} = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', getStudents);
router.get('/:id', getStudent);

// Protected routes
router.get('/skills/mine', protect, getMySkills);
router.post('/skills', protect, addSkill);
router.put('/skills/:id', protect, updateSkill);
router.delete('/skills/:id', protect, deleteSkill);

module.exports = router;